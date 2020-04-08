import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPointDialogComponent } from './data-point-dialog.component';
import { DataViewerModule } from '../data-viewer.module';


describe('DataPointDialog', () => {
  let component: DataPointDialogComponent;
  let fixture: ComponentFixture<DataPointDialogComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [ DataViewerModule ],
      //declarations: [DataPointDialogComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
