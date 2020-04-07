import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationViewComponent } from './destination-view.component';
import { imports } from '../../app.imports';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DestinationViewComponent', () => {
  let component: DestinationViewComponent;
  let fixture: ComponentFixture<DestinationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ DestinationViewComponent ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
