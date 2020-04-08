import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from '../../app.imports';

import { PlatformSelectionComponent } from './platform-selection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('PlatformSelectionComponent', () => {
  let component: PlatformSelectionComponent;
  let fixture: ComponentFixture<PlatformSelectionComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [PlatformSelectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
