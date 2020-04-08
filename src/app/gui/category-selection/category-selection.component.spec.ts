import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from '../../app.imports';

import { CategorySelectionComponent } from './category-selection.component';

describe('CategorySelectionComponent', () => {
  let component: CategorySelectionComponent;
  let fixture: ComponentFixture<CategorySelectionComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ CategorySelectionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
