import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsViewComponent } from './settings-view.component';
import { imports } from '../../app.imports';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SettingsViewComponent', () => {
  let component: SettingsViewComponent;
  let fixture: ComponentFixture<SettingsViewComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ SettingsViewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
