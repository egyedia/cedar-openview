import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {RestApiUrlService} from '../rest-api-url.service';
import {Router} from '@angular/router';
import {GenericMultiLoaderService} from './generic-multi-loader';
import {TemplateField} from '../../shared/model/template-field.model';
import {SnotifyService} from 'ng-alt-snotify';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateFieldService extends GenericMultiLoaderService<TemplateField> {

  protected constructor(
    protected http: HttpClient,
    protected restApiUrl: RestApiUrlService,
    protected router: Router,
    protected notify: SnotifyService,
    protected translateService: TranslateService
  ) {
    super(http, restApiUrl, router, notify, translateService);
  }

  getTemplateField(templateFieldId: string): Observable<TemplateField> {
    return this.getData(templateFieldId, this.restApiUrl.templateField(templateFieldId));
  }
}
