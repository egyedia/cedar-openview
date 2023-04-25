import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {CedarArtifact} from '../../../../shared/model/cedar-artifact.model';
import {CedarBase} from '../base/cedar-base.component';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-artifact-header',
  templateUrl: './artifact-header.component.html',
  styleUrls: ['./artifact-header.component.scss']
})
export class ArtifactHeaderComponent extends CedarBase implements OnInit {

  @Input() artifact: CedarArtifact;
  @Input() cedarLink: string;
  isHidden: boolean;

  params: Object;

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    protected uiService: UiService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
    this.isHidden = true;
  }

  ngOnInit() {
    this.params = {};
    this.params['link'] = this.cedarLink;
    this.uiService.registerArtifactHeaderComponent(this);
  }

  openInCedar() {
    this.uiService.openInCedar();
  }

  doOpen() {
    this.isHidden = false;
  }

  doClose() {
    this.isHidden = true;
  }

  artifactIsTemplate() {
    return this.artifact['@type'] === 'https://schema.metadatacenter.org/core/Template';
  }

  populateInCedar() {
    this.uiService.populateInCedar();
  }
}
