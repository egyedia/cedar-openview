import {AppConfigService} from './app-config.service';


export class AutocompleteUrlService {

  constructor(
    private configService: AppConfigService
  ) {
    this.terminologyService = this.configService.appConfig.terminologyUrl;
    this.controlledService = this.configService.appConfig.terminologyUrl + 'bioportal';
  }

  private terminologyService;
  private controlledService;

  paging(page, size, defaultPage, defaultSize, pageString, sizeString) {
    const p = page > 0 ? page : defaultPage;
    const s = size > 0 ? size : defaultSize;
    return pageString + '=' + p + '&' + sizeString + '=' + s;
  }

  terminology() {
    return this.terminologyService;
  }

  controlledTerm() {
    return this.controlledService;
  }

  getValuesInValueSet(vsCollection, vsId, page?: string, size?: string) {
    return this.controlledTerm() + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(vsId)
      + '/values?' + this.paging(page, size, 1, 50, 'page', 'pageSize');
  }

  autocompleteOntology(query: string, acronym: string, page?: number, size?: number) {
    let url = this.controlledTerm();
    if (query === '*') {
      url += '/ontologies/' + acronym + '/classes?' + this.paging(page, size, 1, 500, 'page', 'page_size');
    } else {
      url += '/search?q=' + encodeURIComponent(query) +
        '&scope=classes&sources=' + acronym + '&suggest=true&' + this.paging(page, size, 1, 500, 'page', 'page_size');
    }
    return url;
  }

  autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth?: number, page?: number, size?: number) {
    let url = this.controlledTerm();

    if (query === '*') {
      url += '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id)
        + '/descendants?' + this.paging(page, size, 1, 500, 'page', 'page_size');
    } else {
      url += '/search?q=' + encodeURIComponent(query) + '&scope=classes' + '&source=' + acronym +
        '&subtree_root_id=' + encodeURIComponent(subtree_root_id) + '&max_depth=' + max_depth +
        '&suggest=true&' + this.paging(page, size, 1, 500, 'page', 'page_size');
    }

    return url;
  }

}
