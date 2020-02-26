import { Component, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wwv';
  languageList = [
    { code: 'en', label: 'English'},
    { code: 'sv', label: 'Svenska'},
    { code: 'es', label: 'Español'}
  ];
  constructor(@Inject(LOCALE_ID) protected localeId: string) {}
}
