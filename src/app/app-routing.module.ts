import { NgModule } from '@angular/core';
import {
  RouterModule, Routes,
} from '@angular/router';

import { HomePageComponent } from './gui/home-page/home-page.component';
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HelpPageComponent} from './gui/help-page/help-page.component';
import {
  PlatformSelectionComponent
} from './gui/platform-selection/platform-selection.component';
import {
  CategorySelectionComponent
} from './gui/category-selection/category-selection.component';
import {
  EditorViewComponent
} from './gui/editor-view/editor-view.component';
import {
  InspectionViewComponent
} from './gui/inspection-view/inspection-view.component';
import {
  DestinationViewComponent
} from './gui/destination-view/destination-view.component';
import {
  SettingsViewComponent
} from './gui/settings-view/settings-view.component';
import {
  SelectionViewComponent
} from './gui/selection-view/selection-view.component';  
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
import { FourFourPageComponent, FiveOhPageComponent } from './error-pages/error-pages.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'help', component: HelpPageComponent },
  { path: 'info', component: InfoPageComponent },
  { path: '', children: [
    { path: 'home', component: HomePageComponent },
    { path: 'platform-selection', component: PlatformSelectionComponent },
    { path: 'category-selection/:platform',
    component: CategorySelectionComponent },
    { path: 'inspection', component: InspectionViewComponent },
    { path: 'destination', component: DestinationViewComponent},
    { path: 'edit', component: EditorViewComponent },
    { path: 'settings', component: SettingsViewComponent },
    { path: 'selection', component: SelectionViewComponent },
  ]},
  { path: '404', component: FourFourPageComponent},
  { path: '500', component: FiveOhPageComponent},
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule, DataViewerModule ],
  exports: [ RouterModule ],
})

export class AppRoutingModule {}
