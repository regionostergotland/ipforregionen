import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomGoogleApiModule } from 'src/app/google-fit-config';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { HammerModule } from '@angular/platform-browser';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import {
    DataTableComponent,
} from './data-table/data-table.component';
import {
  DataContainerComponent
} from './data-container/data-container.component';
import {
  DataFilterDialogComponent
} from './data-filter-dialog/data-filter-dialog.component';
import {
  DataRemovalDialogComponent
} from './data-removal-dialog/data-removal-dialog.component';
import { DataChartComponent } from './data-chart/data-chart.component';
import {
  DataPointDialogComponent
} from './data-point-dialog/data-point-dialog.component';

@NgModule({
  imports: [
    NgxChartsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatExpansionModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatFormFieldModule,
    MatTableModule,
    HttpClientModule,
    CustomGoogleApiModule,
    HammerModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [
    DataChartComponent,
    DataPointDialogComponent,
    DataTableComponent,
    DataFilterDialogComponent,
    DataContainerComponent,
    DataRemovalDialogComponent,
  ],
  exports: [DataContainerComponent],
  entryComponents: [
    DataTableComponent,
    DataContainerComponent,
    DataPointDialogComponent,
    DataFilterDialogComponent,
    DataRemovalDialogComponent,
  ],

  providers: [
      {provide: MatDialogRef, useValue: {}},
      { provide: MAT_DIALOG_DATA, useValue: {} }, ]
})
export class DataViewerModule {}
