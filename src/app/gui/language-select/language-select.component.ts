import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { i18n } from '@angular/core/src/render3';
registerLocaleData(localeSv, 'sv');

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})

export class LanguageSelectComponent implements OnInit {
  languageList = [
    { code: 'en', label: 'EN'},
    { code: 'sv', label: 'SV'},
    { code: 'es', label: 'ES'}
  ];
  constructor(@Inject(LOCALE_ID)
  public localeId: string,
  private route: ActivatedRoute,
  public router: Router)
  {
    this.getLocale();
    console.log('language-select router locale', localeId);
  }

  setLocale(languageCode: string) {
    this.localeId = languageCode;
    console.log('language', languageCode);
    localStorage.setItem('language', JSON.stringify(languageCode));
    window.location.reload(true);
  }

  // TODO: Få denna att fungera. Just nu kan man hämta sparat språk från local storage men inte
  // 'tvinga' appen att använde den som locale. Pipelines?

  //TODO: Ta reda på var en-US kommer ifrån och få appen att sluta med det.
  getLocale() {
    if(JSON.parse(localStorage.getItem('language')) === null){
      this.localeId = 'sv';
    }
    else{
      this.localeId = JSON.parse(localStorage.getItem('language'));
    }
    console.log('language-select getLocale() language', this.localeId);
  }

  ngOnInit() {}
}
