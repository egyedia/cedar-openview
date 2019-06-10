import {Component, OnInit} from '@angular/core';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CedarPageComponent} from '../../../shared/components/base/cedar-page-component.component';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-snotify';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {DataHandlerDataId} from '../../../shared/model/data-handler-data-id.model';
import {TemplateInstance} from '../../../../shared/model/template-instance.model';
import {DataHandlerDataStatus} from '../../../shared/model/data-handler-data-status.model';
import {environment} from '../../../../../environments/environment';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AutocompleteService} from '../../../../services/autocomplete.service';
import {forkJoin} from 'rxjs';
import {InstanceService} from '../../../cedar-metadata-form/services/instance.service';
import {TemplateService} from '../../../cedar-metadata-form/services/template.service';
import {TemplateSchema} from '../../../cedar-metadata-form/models/template-schema.model';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-template-instance',
  templateUrl: './template-instance.component.html',
  styleUrls: ['./template-instance.component.less']
})
export class TemplateInstanceComponent extends CedarPageComponent implements OnInit {

  templateInstanceId: string = null;
  templateInstance: TemplateInstance = null;
  artifactStatus: number = null;
  cedarLink: string = null;

  template: any = null;
  templateId: string = null;
  form: FormGroup;
  viewOnly = false;
  allPosts;
  showForm = false;

  constructor(
    protected localSettings: LocalSettingsService,
    public translateService: TranslateService,
    public notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    private http: HttpClient,
    private autocompleteService: AutocompleteService,
    private uiService: UiService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.allPosts = [];
    this.initDataHandler();

    this.templateInstanceId = this.route.snapshot.paramMap.get('templateInstanceId');
    this.cedarLink = environment.cedarUrl + 'instances/edit/' + this.templateInstanceId;
    this.dataHandler
      .requireId(DataHandlerDataId.TEMPLATE_INSTANCE, this.templateInstanceId)
      .load(() => this.instanceLoadedCallback(this.templateInstanceId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }


  private instanceLoadedCallback(instanceId) {
    this.templateInstance = this.dataStore.getTemplateInstance(this.templateInstanceId);
    this.templateId = TemplateService.isBasedOn(this.templateInstance);

    // load the template it is based on
    this.dataHandler
      .requireId(DataHandlerDataId.TEMPLATE, this.templateId)
      .load(() => this.templateLoadedCallback(this.templateId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private templateLoadedCallback(templateId) {
    this.template = this.dataStore.getTemplate(templateId);

    // if this is a default instance, save the template info
    if (!TemplateService.isBasedOn(this.templateInstance)) {
      const schema = TemplateService.schemaOf(this.template) as TemplateSchema;
      InstanceService.setBasedOn(this.templateInstance, TemplateService.getId(schema));
      InstanceService.setName(this.templateInstance, TemplateService.getName(schema));
      InstanceService.setHelp(this.templateInstance, TemplateService.getHelp(schema));
    }
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
  }

  protected onAutocomplete(event) {
    if (event['search']) {
      forkJoin(this.autocompleteService.getPosts(event['search'], event.constraints)).subscribe(posts => {
        console.log('posts', posts);
        this.allPosts = [];
        for (let i = 0; i < posts.length; i++) {
          this.allPosts = this.allPosts.concat(posts[i]['collection']);
        }
        console.log('allPosts', this.allPosts);
      });
    }
  }

  // toggle edit/view button
  toggleDisabled() {
    this.viewOnly = !this.viewOnly;
  }

  // copy content to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {
    this.uiService.copyToClipboard(elementId, buttonId);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('form submitted');
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormArray) {
        control.controls.forEach(cntl => {
          cntl.markAsTouched({onlySelf: true});
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  selectedTabChange(event) {

    if (event.index === 0) {
      setTimeout(() => {
        console.log('redraw form');
        this.showForm = true;
      }, 0);

    } else {
      this.showForm = false;
    }
  }

  // form changed, update tab contents and submit button status
  protected onChanged(event) {
    const e = event;
    // setTimeout(() => {
    //   this.payload = e.payload;
    //   this.jsonLD = e.jsonLD;
    //   this.rdf = e.rdf;
    //   this.formValid = e.formValid;
    // }, 0);
  }

}
