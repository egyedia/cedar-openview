import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ArtifactHeaderComponent} from './components/artifact-header/artifact-header.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {JsonViewComponent} from './components/json-view/json-view.component';
import {ArtifactErrorComponent} from './components/artifact-error/artifact-error.component';
import {MaterialModule} from '../../modules/material-module';
import {LegendComponent} from './components/legend/legend.component';
import {FormResultsComponent} from './components/form-results/form-results.component';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FooterComponent} from './components/footer/footer.component';
import {ViewHeaderComponent} from './components/view-header/view-header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MaterialModule,
    FontAwesomeModule
  ],
  declarations: [
    SpinnerComponent,
    DashboardComponent,
    ArtifactHeaderComponent,
    ArtifactErrorComponent,
    NavbarComponent,
    ViewHeaderComponent,
    FooterComponent,
    JsonViewComponent,
    LegendComponent,
    FormResultsComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    SpinnerComponent,
    ArtifactHeaderComponent,
    ArtifactErrorComponent,
    NavbarComponent,
    ViewHeaderComponent,
    FooterComponent,
    JsonViewComponent,
    LegendComponent,
    FormResultsComponent
  ]
})
export class SharedModule {
}
