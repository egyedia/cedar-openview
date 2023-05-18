import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {AutocompleteUrlService} from './autocomplete-url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AutocompleteResponse} from '../modules/shared/model/autocomplete-response.model';


@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(
    private http: HttpClient,
    private autocompleteUrlService: AutocompleteUrlService
  ) {
  }

  private getClasses(searchOption: string, valueConstraints: any): Observable<AutocompleteResponse>[] {
    const result = [];
    let myObservable: Observable<AutocompleteResponse>;
    if (valueConstraints.classes && valueConstraints.classes.length > 0) {

      for (let i = 0; i < valueConstraints.classes.length; i++) {
        const klass = valueConstraints.classes[i];
        const response: AutocompleteResponse = {
          page: 0,
          pageCount: 1,
          pageSize: 1,
          prevPage: 0,
          nextPage: 0,
          collection: [{
            '@id': klass.uri,
            prefLabel: klass.label,
            source: 'template',
            type: klass.type,
            uri: klass.uri
          }]
        };
        myObservable = of(response);
        result.push(myObservable);
      }
    }
    return result;
  }

  private getUrls(searchOption: string, valueConstraints: any): string[] {
    const result: string[] = [];

    if (valueConstraints.valueSets && valueConstraints.valueSets.length > 0) {
      for (let i = 0; i < valueConstraints.valueSets.length; i++) {
        const valueSet = valueConstraints.valueSets[i];
        const acronym = valueSet.vsCollection.substr(valueSet.vsCollection.lastIndexOf('/') + 1);
        result.push(this.autocompleteUrlService.getValuesInValueSet(acronym, valueSet.uri));
      }
    }
    if (valueConstraints.ontologies && valueConstraints.ontologies.length > 0) {
      for (let i = 0; i < valueConstraints['ontologies'].length; i++) {
        const ontology = valueConstraints['ontologies'][i];
        result.push(this.autocompleteUrlService.autocompleteOntology(searchOption, ontology['acronym']));
      }
    }
    if (valueConstraints.branches && valueConstraints.branches.length > 0) {
      for (let i = 0; i < valueConstraints['branches'].length; i++) {
        const branch = valueConstraints['branches'][i];
        const maxDepth = 10;
        result.push(this.autocompleteUrlService.autocompleteOntologySubtree(searchOption, branch['acronym'], branch['uri'], maxDepth));
      }
    }
    return result;
  }

  getPosts(searchOption: string, valueConstraints: any): Observable<AutocompleteResponse>[] {
    // do we have a search string?
    if (typeof searchOption === 'string' && searchOption.length) {

      // build all the urls that capture the value constraints
      const urls: string[] = this.getUrls(searchOption, valueConstraints);
      const headers = new HttpHeaders().set('Authorization', 'apiKey ' + localStorage.getItem('apiKey'));
      const responses: Observable<AutocompleteResponse>[] = this.getClasses(searchOption, valueConstraints);
      for (let i = 0; i < urls.length; i++) {
        responses.push(this.http.get<AutocompleteResponse>(urls[i], {headers: headers}));
      }
      return responses;

    } else {
      // no, so return an empty response
      const response: AutocompleteResponse = {
        page: 0,
        pageCount: 1,
        pageSize: 1,
        prevPage: 0,
        nextPage: 0,
        collection: []
      };
      const myObservable = of(response);
      return [myObservable];
    }
  }


}
