import {Injectable} from '@angular/core';
import {AppConfigService} from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiUrlService {

  API_URL: string = this.configService.appConfig.apiUrl;

  constructor(
    private configService: AppConfigService
  ) {
  }

  private base() {
    return `${this.API_URL}`;
  }

  private templateFields() {
    return `${this.base()}template-fields`;
  }

  private templateElements() {
    return `${this.base()}template-elements`;
  }

  private templates() {
    return `${this.base()}templates`;
  }

  private templateInstances() {
    return `${this.base()}template-instances`;
  }

  templateField(id: string) {
    return `${this.templateFields()}/${encodeURIComponent(id)}`;
  }

  templateElement(id: string) {
    return `${this.templateElements()}/${encodeURIComponent(id)}`;
  }

  template(id: string) {
    return `${this.templates()}/${encodeURIComponent(id)}`;
  }

  templateInstance(id: string) {
    return `${this.templateInstances()}/${encodeURIComponent(id)}`;
  }

}
