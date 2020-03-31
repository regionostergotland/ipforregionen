import { Injectable, NgModule, LOCALE_ID } from '@angular/core';
import {
  Router, RouterModule, Routes,
  CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot
} from '@angular/router';

import { LoginComponent } from './gui/login/login.component';
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
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';

import { AuthService } from 'src/app/auth.service';
import { LocaleDataIndex } from '@angular/common/src/i18n/locale_data';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const can: boolean = this.auth.isAuthenticated();
    if (!can) {
      this.router.navigateByUrl('/login');
    }
    return can;
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //TODO: Ladda in language från local storage och redirecta till den istället för hårdkodad sv
  { path: 'login', redirectTo: 'sv/login'},
  { path: 'sv/login', component: LoginComponent },
  { path: 'help', component: HelpPageComponent },
  { path: 'info', component: InfoPageComponent },
  { path: '', canActivate: [AuthGuard], children: [
    { path: 'home', component: HomePageComponent },
    { path: 'platform-selection', component: PlatformSelectionComponent },
    { path: 'category-selection/:platform',
      component: CategorySelectionComponent },
    { path: 'inspection', component: InspectionViewComponent },
    { path: 'destination', component: DestinationViewComponent},
    { path: 'edit', component: EditorViewComponent },
    { path: 'settings', component: SettingsViewComponent },
  ]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule, DataViewerModule ],
  exports: [ RouterModule ],
})

export class AppRoutingModule {}
