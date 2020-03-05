import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BluetoothSourceComponent } from './bluetooth-source.component';

describe('BluetoothSourceComponent', () => {
  let component: BluetoothSourceComponent;
  let fixture: ComponentFixture<BluetoothSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BluetoothSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
