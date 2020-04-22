import { Component } from '@angular/core';

import { ConfigService } from 'src/app/config.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  assetUrl: string;

  constructor(
    private cfg: ConfigService,
    public translate: TranslateService
  ) {
    this.assetUrl = this.cfg.getAssetUrl();
    translate.addLangs(['sv', 'en']);
    translate.setDefaultLang('sv');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
