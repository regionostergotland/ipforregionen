import { Component, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wwv';
  languageList = [
    { code: 'en', label: 'EN'},
    { code: 'sv', label: 'SV'},
    { code: 'es', label: 'ES'}
  ];
  constructor(@Inject(LOCALE_ID) protected localeId: string) {
    console.log('locale', localeId);
  }
}
