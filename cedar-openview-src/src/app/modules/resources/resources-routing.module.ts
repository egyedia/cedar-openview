import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EverytimeService} from '../../services/can-activate/everytime.service';
import {TemplateComponent} from './pages/template/template.component';
import {TemplateElementComponent} from './pages/template-element/template-element.component';
import {TemplateFieldComponent} from './pages/template-field/template-field.component';
import {TemplateInstanceComponent} from './pages/template-instance/template-instance.component';
import {FolderContentComponent} from './pages/folder-content/folder-content.component';

export const routes: Routes = [
  {
    path: 'templates/:templateId',
    component: TemplateComponent,
    canActivate: [EverytimeService]
  },
  {
    path: 'template-elements/:templateElementId',
    component: TemplateElementComponent,
    canActivate: [EverytimeService]
  },
  {
    path: 'template-fields/:templateFieldId',
    component: TemplateFieldComponent,
    canActivate: [EverytimeService]
  },
  {
    path: 'template-instances/:templateInstanceId',
    component: TemplateInstanceComponent,
    canActivate: [EverytimeService]
  },
  {
    path: 'folders/:folderId',
    component: FolderContentComponent,
    canActivate: [EverytimeService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {
}
