import {Injectable} from '@angular/core';

@Injectable()
export class TemplateService {

  constructor() {}

  static schemaOf(node): any {
    return (node && node.type === 'array' && node.items) ? node.items : node;
  }

  static isBasedOn(schema: any) {
    return schema['schema:isBasedOn'];
  }

  static getId(schema: any) {
    return schema['@id'];
  }

  static getName(schema: any) {
    return schema['schema:name'];
  }

  static getHelp(schema: any) {
    return schema['schema:description'];
  }

  static initInstance(template: any) {
    const schema = TemplateService.schemaOf(template);
    return {
      '@context': {
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'xsd': 'http://www.w3.org/2001/XMLSchema#',
        'pav': 'http://purl.org/pav/',
        'schema': 'http://schema.org/',
        'oslc': 'http://open-services.net/ns/core#',
        'skos': 'http://www.w3.org/2004/02/skos/core#',
        'rdfs:label': {
          '@type': 'xsd:string'
        },
        'schema:isBasedOn': {
          '@type': '@id'
        },
        'schema:name': {
          '@type': 'xsd:string'
        },
        'schema:description': {
          '@type': 'xsd:string'
        },
        'pav:createdOn': {
          '@type': 'xsd:dateTime'
        },
        'pav:createdBy': {
          '@type': '@id'
        },
        'pav:lastUpdatedOn': {
          '@type': 'xsd:dateTime'
        },
        'oslc:modifiedBy': {
          '@type': '@id'
        },
        'skos:notation': {
          '@type': 'xsd:string'
        }
      },
      'schema:isBasedOn': TemplateService.getId(schema),
      'schema:name':  TemplateService.getName(schema),
      'schema:description': TemplateService.getHelp(schema),
      'pav:createdOn': '',
      'pav:createdBy': '',
      'pav:lastUpdatedOn': '',
      'oslc:modifiedBy': '',
      '@id': ''
    };
  }

  static setBasedOn(instance: any, id: string) {
    instance['schema:isBasedOn'] = id;
    return instance;
  }

  static setHelp(instance: any, help: string) {
    instance['schema:description'] = help;
    return instance;
  }

  static setName(instance: any, name: string) {
    instance['schema:name'] = name;
    return instance;
  }

}
