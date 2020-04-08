import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from '../../app.imports';
import { EditorViewComponent } from './editor-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EditorViewComponent', () => {
  let component: EditorViewComponent;
  let fixture: ComponentFixture<EditorViewComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ EditorViewComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
