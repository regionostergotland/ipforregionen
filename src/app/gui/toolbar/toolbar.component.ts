import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from 'src/app/config.service';
import { AuthService } from 'src/app/auth.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  assetUrl: string;

  constructor(
    private router: Router,
    private cfg: ConfigService,
    private auth: AuthService,
    public translate: TranslateService
  ) {
    this.assetUrl = this.cfg.getAssetUrl();
    translate.addLangs(['sv', 'en']);
    translate.setDefaultLang('sv');
  }

  // isAuthenticated() {
  //   return this.auth.isAuthenticated();
  // }

  // pnr() {
  //   return this.auth.getUser().pnr;
  // }

  // fullName() {
  //   return this.auth.getUser().fullName;
  // }

  // signOut() {
  //   this.auth.deauthenticate();
  //   this.router.navigateByUrl('login');
  // }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
