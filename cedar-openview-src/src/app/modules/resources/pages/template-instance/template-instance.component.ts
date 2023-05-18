import {Component, OnInit} from '@angular/core';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CedarPageComponent} from '../../../shared/components/base/cedar-page-component.component';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {DataHandlerDataId} from '../../../shared/model/data-handler-data-id.model';
import {TemplateInstance} from '../../../../shared/model/template-instance.model';
import {DataHandlerDataStatus} from '../../../shared/model/data-handler-data-status.model';
import {HttpClient} from '@angular/common/http';
import {AutocompleteService} from '../../../../services/autocomplete.service';
import {forkJoin} from 'rxjs';
import {UiService} from '../../../../services/ui.service';
import {TemplateService} from '../../../../services/template.service';
import * as jsonld from 'jsonld';
import {AppConfigService} from '../../../../services/app-config.service';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-template-instance',
  templateUrl: './template-instance.component.html',
  styleUrls: ['./template-instance.component.scss']
})
export class TemplateInstanceComponent extends CedarPageComponent implements OnInit {

  templateInstanceId: string = null;
  instance: TemplateInstance = null;
  artifactStatus: number = null;
  templateStatus: number = null;
  cedarLink: string = null;

  template: any = null;
  templateId: string = null;
  mode = 'view';
  allPosts;
  rdf: any;

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
    private uiService: UiService,
    private configService: AppConfigService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
    this.allPosts = [];
    this.initDataHandler();

    this.templateInstanceId = this.route.snapshot.paramMap.get('templateInstanceId');
    this.cedarLink = environment.cedarUrl + 'instances/edit/' + this.templateInstanceId;
    this.dataHandler
      .requireId(DataHandlerDataId.TEMPLATE_INSTANCE, this.templateInstanceId)
      .load(() => this.instanceLoadedCallback(this.templateInstanceId),
        (error, dataStatus) => this.instanceErrorCallback(error, dataStatus));
  }

  private instanceLoadedCallback(instanceId) {
    this.instance = this.dataStore.getTemplateInstance(this.templateInstanceId);
    this.templateId = TemplateService.isBasedOn(this.instance);

    // load the template it is based on
    this.dataHandler
      .requireId(DataHandlerDataId.TEMPLATE, this.templateId)
      .load(() => this.templateLoadedCallback(this.templateId), (error, dataStatus) => this.templateErrorCallback(error, dataStatus));
  }

  private templateLoadedCallback(templateId) {
    this.template = this.dataStore.getTemplate(templateId);

    // if this is a default instance, save the template info
    if (!TemplateService.isBasedOn(this.instance)) {
      const schema = TemplateService.schemaOf(this.template);
      TemplateService.setBasedOn(this.instance, TemplateService.getId(schema));
      TemplateService.setName(this.instance, TemplateService.getName(schema));
      TemplateService.setHelp(this.instance, TemplateService.getHelp(schema));
    }
  }

  private instanceErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
  }

  private templateErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.templateStatus = error.status;
  }

  protected onAutocomplete(event) {
    if (event['search']) {
      forkJoin(this.autocompleteService.getPosts(event['search'], event.constraints)).subscribe(posts => {
        this.allPosts = [];
        for (let i = 0; i < posts.length; i++) {
          this.allPosts = this.allPosts.concat(posts[i]['collection']);
        }
      });
    }
  }

  // copy content to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {
    this.uiService.copyToClipboard(elementId, buttonId);
  }

  // form changed, update tab contents and submit button status
  onFormChange(event) {
    if (event && event.detail) {
      this.uiService.setTitleAndDescription(event.detail.title, event.detail.description, 'TemplateInstance');
      this.uiService.setValidity(event.detail.validity);
      setTimeout(() => {
        const that = this;
        jsonld.toRDF(this.instance, {format: 'application/nquads'}, function (err, nquads) {
          that.rdf = err ? err : nquads;
        });
      }, 0);
    }
  }

}
