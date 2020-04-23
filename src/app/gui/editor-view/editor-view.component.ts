import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Conveyor } from 'src/app/conveyor.service';
import { AddNewDataModalComponent } from './add-new-data-modal.component';
import { ConfigService } from 'src/app/config.service';
import {
  BottomSheetCategoriesComponent
} from './bottom-sheet-categories.component';
import { Categories } from 'src/app/ehr/ehr-config';
import { DataList } from '../../ehr/datalist';
import { DataPoint } from 'src/app/ehr/datalist';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {

  assetUrl: string;
  title = 'Kategorier';
  selectedCategory: string = null;
  selectedColor = '#e7e7e7';
  showFiller = false;

  constructor(
    private cfg: ConfigService,
    private conveyor: Conveyor,
    private bottomSheet: MatBottomSheet,
    public router: Router,
    public dialog: MatDialog
    ) {
      this.assetUrl = cfg.getAssetUrl();
    }

  openAddNewDataModal(): void {
    const dialogRef = this.dialog.open(AddNewDataModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'app') {
        this.router.navigateByUrl('/platform-selection');
      } else if (result === 'category') {
        this.openBottomSheet();
      }
    });
  }

  logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
  }

  ngOnInit() {
    //Display categories stored in localstorage
    let all_categories = this.conveyor.getAllCategories();
    all_categories.forEach(categoryID => {
      if (localStorage.getItem(categoryID)){
        let dataList = new DataList(this.conveyor.getCategorySpec(categoryID));
        console.log(JSON.parse(localStorage.getItem(categoryID))[0]);
        //dataList.addPoints(JSON.parse(localStorage.getItem(categoryID)));
        this.conveyor.setDataList(categoryID, dataList);

        //console.log(localStorage.getItem(categoryID));

        let current_category = JSON.parse(localStorage.getItem(categoryID));
        console.log("TESTITEST: " + current_category[1]);
        let point_map = new Map(current_category);
        // FÖRSÖK OMVANDLA CURRENT_CATEGORY TILL EN MAP NÄSTA GÅNG
        //dataList.addPoints(current_category); 
        // for (let point = 0; point < current_category.length; point++)
        // {
        //   console.log("DETTA ÄR POINT AV JSONPARSE: " + current_category[point]);
        //   point_map = new Map (current_category[point])
      }
    });



    /*    let dataPoint: DataPoint = this.dataPoint;
    if (!dataPoint) {
      dataPoint = new DataPoint();
    }

    // set the datapoint values from the forms
    for (const data of Array.from(this.pointData.keys())) {
      dataPoint.set(data, this.pointData.get(data));
    }

    // Dont add a point that already exists
    if (!this.dataPoint) {
      this.conveyor.getDataList(this.selectedCategory).addPoint(dataPoint);
    }*/

    /*    if (!this.conveyor.hasCategoryId(categoryId)) {
      this.conveyor.setDataList(
        categoryId,
        new DataList(this.conveyor.getCategorySpec(categoryId))
      );
    }*/
  }

  getMode(): string {
    // lt-md / lt-sm
    if (window.matchMedia('(max-width: 959px)').matches) {
        return 'bottom';
    }

    return 'side';
  }

  getContainerClass(): string {
    if (this.getMode() === 'side') {
      return 'content-container border';
    }

    return 'content-container';
  }

  selectCategory(category: string): void {
    console.log(category);
      this.selectedCategory = category;
  }

  /**
   * Gets a list of the IDs of all categories available in the conveyor.
   * @returns a list of category IDs.
   */
  getUserCategories(): string[] {
    return this.conveyor.getCategoryIds();
  }

  /**
   * Gets the label of a specific category to display on the page.
   * @param categoryId id of the category to get from.
   * @returns the category label.
   */
  getCategoryLabel(categoryId: string): string {
      return this.conveyor.getCategorySpec(categoryId).label;
  }

  /**
   * Gets the icon of a specific category to display on the page.
   * @param categoryId id of the category to get from.
   * @returns the project path to the icon image.
   */
  getCategoryIcon(categoryId: string): string {
    const baseUrl = this.cfg.getAssetUrl() + 'flaticon/';
    return baseUrl + this.conveyor.getCategorySpec(categoryId).id + '.png';
  }

  /**
   * Return the color of the selected category and return an empty string if no
   * category is selected.
   * @returns hex value of background color or empty string.
   */
  getTitleSelected(): string {
    return this.selectedCategory === null ? this.selectedColor : '';
  }

  /**
   * Gets the background color to be displayed for the category-list.
   * @param categoryId id of the category to get from.
   * @returns hex value of background color.
   */
  getBackgroundColor(categoryId: string): string {
    if (categoryId === this.selectedCategory) {
      return this.selectedColor;
    }
    return '';
  }

  /**
   * Opens the pop-up menu for selecting a new category.
   */
  openBottomSheet(): void {
// tslint:disable-next-line: no-use-before-declare
    this.bottomSheet.open(BottomSheetCategoriesComponent);
  }
}
