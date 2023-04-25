import {Component, Input} from '@angular/core';
import {UiService} from '../../../../services/ui.service';


@Component({
  selector: 'app-form-results',
  templateUrl: './form-results.component.html',
  styleUrls: ['./form-results.component.scss'],
  providers: []
})

export class FormResultsComponent {

  @Input() instance: any;
  @Input() template: any;
  @Input() rdf: any;

  constructor(private uiService: UiService) {
  }

  // copy content to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {
    this.uiService.copyToClipboard(elementId, buttonId);
  }

  isTemplateField(field: any) {
    return field != null &&
      field.hasOwnProperty('@type') &&
      field['@type'] === 'https://schema.metadatacenter.org/core/TemplateField';
  }

  isTemplateElement(element: any) {
    return element != null &&
      element.hasOwnProperty('@type') &&
      element['@type'] === 'https://schema.metadatacenter.org/core/TemplateElement';
  }

  isTemplate(template: any, instance: any) {
    return template != null &&
      template.hasOwnProperty('@type') &&
      template['@type'] === 'https://schema.metadatacenter.org/core/Template' &&
      (instance == null || instance['@id'] == null || instance['@id'].length === 0);
  }

  isTemplateInstance(template: any, instance: any) {
    return template != null &&
      template.hasOwnProperty('@type') &&
      template['@type'] === 'https://schema.metadatacenter.org/core/Template' &&
      (instance != null && instance['@id'] != null && instance['@id'].length > 0);
  }
}
