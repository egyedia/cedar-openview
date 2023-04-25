import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-alt-snotify';
import {SpinnerComponent} from './modules/shared/components/spinner/spinner.component';
import {NavbarComponent} from './modules/shared/components/navbar/navbar.component';
import {FooterComponent} from './modules/shared/components/footer/footer.component';
import {MaterialModule} from './modules/material-module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpLoaderFactory} from './app.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SnotifyModule,
        MaterialModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        AppComponent,
        SpinnerComponent,
        NavbarComponent,
        FooterComponent
      ],
      providers: [
        SnotifyService,
        {
          provide: 'SnotifyToastConfig',
          useValue: ToastDefaults
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
