import {Component, OnInit} from '@angular/core';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CedarPageComponent} from '../../../shared/components/base/cedar-page-component.component';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {DataHandlerDataId} from '../../../shared/model/data-handler-data-id.model';
import {TemplateElement} from '../../../../shared/model/template-element.model';
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
  selector: 'app-template-element',
  templateUrl: './template-element.component.html',
  styleUrls: ['./template-element.component.scss']
})
export class TemplateElementComponent extends CedarPageComponent implements OnInit {

  templateElementId: string = null;
  template: TemplateElement = null;
  artifactStatus: number = null;
  cedarLink: string = null;
  instance: any = null;
  mode = 'view';
  allPosts;
  rdf: any;

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
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

    this.templateElementId = this.route.snapshot.paramMap.get('templateElementId');
    this.cedarLink = environment.cedarUrl + 'elements/edit/' + this.templateElementId;
    this.dataHandler
      .requireId(DataHandlerDataId.TEMPLATE_ELEMENT, this.templateElementId)
      .load(() => this.dataLoadedCallback(), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private dataLoadedCallback() {
    this.template = this.dataStore.getTemplateElement(this.templateElementId);
    this.instance = TemplateService.initInstance(this.template);
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
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
  onFormChange(event, element) {
    if (event && event.detail) {
      this.uiService.setTitleAndDescription(event.detail.title, event.detail.description, element['@type']);
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
