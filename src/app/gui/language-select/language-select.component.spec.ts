import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from '../../app.imports';

import { LanguageSelectComponent } from './language-select.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LanguageSelectComponent', () => {
  let component: LanguageSelectComponent;
  let fixture: ComponentFixture<LanguageSelectComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ LanguageSelectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
