import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPageComponent } from './info-page.component';
import { imports } from '../../app.imports';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InfoPageComponent', () => {
  let component: InfoPageComponent;
  let fixture: ComponentFixture<InfoPageComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [InfoPageComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
