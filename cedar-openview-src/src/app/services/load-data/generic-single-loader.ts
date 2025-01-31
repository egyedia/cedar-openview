import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {RestApiUrlService} from '../rest-api-url.service';
import {Router} from '@angular/router';
import {AbstractDataLoaderService} from './abstract-data-loader.service';
import {SnotifyService} from 'ng-alt-snotify';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GenericSingleLoaderService<T> extends AbstractDataLoaderService {

  protected constructor(
    protected http: HttpClient,
    protected restApiUrl: RestApiUrlService,
    protected router: Router,
    protected notify: SnotifyService,
    protected translateService: TranslateService
  ) {
    super(http, restApiUrl, router, notify, translateService);
  }

  protected data: T;
  protected observable: Observable<T>;

  getData(url: string, errorCallback: Function): Observable<T> {
    if (this.data) {
      return of(this.data);
    } else if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.http.get<T>(url)
        .pipe(
          tap(data => {
            this.data = data;
            return this.log('fetched data');
          }),
          catchError(this.handleError('getData', errorCallback, null))
        );
      return this.observable;
    }
  }

  public reset() {
    this.data = null;
    this.observable = null;
  }
}
