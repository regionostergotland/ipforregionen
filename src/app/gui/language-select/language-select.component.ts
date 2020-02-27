import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})

class LanguageSelectComponent implements OnInit {
  languageList = [
    { code: 'en', label: 'EN'},
    { code: 'sv', label: 'SV'},
    { code: 'es', label: 'ES'}
  ];
  constructor(@Inject(LOCALE_ID) protected localeId: string) {}

  ngOnInit() {
  }
}

export { LanguageSelectComponent}
