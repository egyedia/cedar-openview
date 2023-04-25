import {CedarPageComponent} from '../../components/base/cedar-page-component.component';
import {Component, OnInit} from '@angular/core';
import {LocalSettingsService} from '../../../../services/local-settings.service';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService} from 'ng-alt-snotify';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStoreService} from '../../../../services/data-store.service';
import {DataHandlerService} from '../../../../services/data-handler.service';
import {AppConfigService} from '../../../../services/app-config.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends CedarPageComponent implements OnInit {

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    private configService: AppConfigService
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
    window.location.href = environment.cedarUrl;
  }

}
