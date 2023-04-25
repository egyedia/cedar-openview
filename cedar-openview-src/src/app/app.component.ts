import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {LocalSettingsService} from './services/local-settings.service';
import {UiService} from './services/ui.service';

import {faBars, faSquare, faTag, faUnlock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showMenu = false;
  artifactTitle = 'artifactTitle';
  artifactDescription = 'artifactDescription';
  faTag = faTag;
  faSquare = faSquare;
  faBars = faBars;
  faUnlock = faUnlock;
  loadAPI: Promise<any>;

  languages = {
    selected: 'en',
    options: [{value: 'en', viewValue: 'en'}, {value: 'hu', viewValue: 'hu'}]
  };

  constructor(
    private localSettings: LocalSettingsService,
    private translateService: TranslateService,
    private uiService: UiService,
    titleService: Title
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translateService.setDefaultLang(environment.fallbackLanguage);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let currentLanguage = localSettings.getLanguage();
    if (currentLanguage == null) {
      currentLanguage = environment.defaultLanguage;
    }
    translateService.use(currentLanguage);

    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      translateService.get('App.WindowTitle').subscribe((res: string) => {
        titleService.setTitle(res);
      });
    });

    uiService.hasTitle.subscribe(
      value => {
        setTimeout(() => {
          this.artifactTitle = value;
        }, 0);
      }
    );

    uiService.hasDescription.subscribe(
      value => {
        setTimeout(() => {
          this.artifactDescription = value;
        }, 0);
      }
    );

  }

  ngOnInit(): void {
  }

  getCurrentLanguageCode() {
    return this.translateService.currentLang;
  }

  switchLanguage($event, language: string) {
    $event.preventDefault();
    this.translateService.use(language);
    this.localSettings.setLanguage(language);
  }

  setLanguage(language: string) {
    this.translateService.use(language);
    this.localSettings.setLanguage(language);
  }
}
