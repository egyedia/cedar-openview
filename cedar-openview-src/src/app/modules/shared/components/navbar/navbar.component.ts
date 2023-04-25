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
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends CedarBase implements OnInit {

  constructor(
    protected localSettings: LocalSettingsService,
    protected translateService: TranslateService,
    protected notify: SnotifyService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dataStore: DataStoreService,
    protected dataHandler: DataHandlerService,
    public uiService: UiService,
  ) {
    super(localSettings, translateService, notify, router, route, dataStore, dataHandler);
  }

  ngOnInit() {
  }

  getCurrentLanguageCode() {
    return this.translateService.currentLang;
  }

  switchLanguage($event, language: string) {
    $event.preventDefault();
    this.translateService.use(language);
    this.localSettings.setLanguage(language);
  }

  openInCedar() {
    this.uiService.openInCedar();
  }

  openInNewWindow(url: string) {
    window.open(url, '_blank');
  }

  expansionOpened() {
    this.uiService.openArtifactHeader();
  }

  expansionClosed() {
    this.uiService.closeArtifactHeader();
  }
}
