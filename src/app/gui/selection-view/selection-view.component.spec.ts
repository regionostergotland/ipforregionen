import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from '../../imports.ts';
import { SelectionViewComponent } from './selection-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('SelectionViewComponent', () => {
  let component: SelectionViewComponent;
  let fixture: ComponentFixture<SelectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ SelectionViewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
