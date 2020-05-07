import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
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

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { HammerModule } from '@angular/platform-browser';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

/* Translation components */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* Main component */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './gui/login/login.component';

/* Page / view components */
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HomePageComponent } from './gui/home-page/home-page.component';
import { HelpPageComponent } from './gui/help-page/help-page.component';
import { SettingsViewComponent } from './gui/settings-view/settings-view.component';
import { SelectionViewComponent } from './gui/selection-view/selection-view.component';
/* Fetching */
import {
  PlatformSelectionComponent
} from './gui/platform-selection/platform-selection.component';
import {
  CategorySelectionComponent
} from './gui/category-selection/category-selection.component';

/* Editing */
import {
  EditorViewComponent,
} from './gui/editor-view/editor-view.component';
import {
  AddNewDataModalComponent
} from './gui/editor-view/add-new-data-modal.component';
import {
  BottomSheetCategoriesComponent
} from './gui/editor-view/bottom-sheet-categories.component';

/* Inspection */
import {
  InspectionViewComponent
} from './gui/inspection-view/inspection-view.component';

/* Destination */
import {
  DestinationViewComponent,
  NewDestinationDialog,
  NewAlertDialog
} from './gui/destination-view/destination-view.component';

/* Common components */
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';

/* Static components */
import {
  ProgressBarComponent
} from './gui/progress-bar/progress-bar.component';
import { FooterComponent } from './gui/footer/footer.component';
import { ToolbarComponent } from './gui/toolbar/toolbar.component';

/* Google Fit configuration */
import { CustomGoogleApiModule } from './google-fit-config';


/* Error pages */
import {
  FourFourPageComponent,
  FiveOhPageComponent
} from './error-pages/error-pages.component';

/* LoginModal */
import { LoginModal } from './gui/inspection-view/login-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    /* pages */
    HomePageComponent,
    InfoPageComponent,
    HelpPageComponent,
    /* static components */
    ProgressBarComponent,
    FooterComponent,
    ToolbarComponent,
    /* views */
    PlatformSelectionComponent,
    CategorySelectionComponent,
    EditorViewComponent,
    InspectionViewComponent,
    /* editor view components */
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
    DestinationViewComponent,
    NewDestinationDialog,
    NewAlertDialog,
    LoginModal,
    SettingsViewComponent,
    SelectionViewComponent,
    FourFourPageComponent,
    FiveOhPageComponent
  ],
  imports: [
    DataViewerModule,
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
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatGridListModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CustomGoogleApiModule,
    DataViewerModule,
    HammerModule,
    NgxMaterialTimepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
    NewDestinationDialog,
    NewAlertDialog,
    SelectionViewComponent,
    LoginModal
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
