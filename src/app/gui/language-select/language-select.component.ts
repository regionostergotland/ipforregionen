import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
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
  protected localeId: string,
  private route: ActivatedRoute,
  public router: Router)
  {
    console.log('locale', localeId);
  }

  setLocale(languageCode: string) {
    this.localeId = languageCode;
    console.log('language', languageCode);
    window.location.reload(true);
  }

  getLocale() {
    return this.localeId;
  }

  ngOnInit() {}
}
