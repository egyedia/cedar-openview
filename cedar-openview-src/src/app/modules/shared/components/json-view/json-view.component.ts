import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {CedarArtifact} from '../../../../shared/model/cedar-artifact.model';
import {CedarBase} from '../base/cedar-base.component';

@Component({
  selector: 'app-json-view',
  templateUrl: './json-view.component.html',
  styleUrls: ['./json-view.component.css']
})
export class JsonViewComponent extends CedarBase {

  @Input() artifact: CedarArtifact;

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
  }

}
