import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RestApiUrlService} from '../rest-api-url.service';
import {Router} from '@angular/router';
import {AbstractDataLoaderService} from './abstract-data-loader.service';
import {SnotifyService} from 'ng-alt-snotify';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GenericMultiLoaderService<T> extends AbstractDataLoaderService {

  protected constructor(
    protected http: HttpClient,
    protected restApiUrl: RestApiUrlService,
    protected router: Router,
    protected notify: SnotifyService,
    protected translateService: TranslateService
  ) {
    super(http, restApiUrl, router, notify, translateService);
  }

  protected data: Map<string, T> = new Map<string, T>();
  protected observable: Map<string, Observable<T>> = new Map<string, Observable<T>>();

  getData(id: string, url: string): Observable<T> {
    if (this.data[id]) {
      return of(this.data[id]);
    } else if (this.observable[id]) {
      return this.observable[id];
    } else {
      this.observable[id] = this.http.get<T>(url)
        .pipe(
          tap(data => {
            this.data[id] = data;
            return this.log('fetched data');
          })
        );
      return this.observable[id];
    }
  }

  public reset() {
    this.data = new Map<string, T>();
    this.observable = new Map<string, Observable<T>>();
  }
}
