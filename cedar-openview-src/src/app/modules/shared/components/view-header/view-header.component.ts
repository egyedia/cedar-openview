import {Component, OnInit} from '@angular/core';
import {DataStoreService} from '../../../../services/data-store.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {SnotifyService} from 'ng-alt-snotify';
import {ActivatedRoute, Router} from '@angular/router';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {CedarBase} from '../base/cedar-base.component';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-view-header',
  templateUrl: './view-header.component.html',
  styleUrls: ['./view-header.component.scss']
})
export class ViewHeaderComponent extends CedarBase implements OnInit {

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    protected uiService: UiService,
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
  }

}
