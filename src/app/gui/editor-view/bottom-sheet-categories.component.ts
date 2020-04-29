import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DataList } from '../../ehr/datalist';
import { Conveyor } from '../../conveyor.service';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-bottom-sheet-categories',
  templateUrl: 'bottom-sheet-categories.component.html',
})
export class BottomSheetCategoriesComponent {
  constructor(
    private cfg: ConfigService,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetCategoriesComponent>,
    private conveyor: Conveyor
  ) {}

  /**
   * Gets a list of the IDs of all categories available.
   * @returns a list of category IDs.
   */
  getAllCategories(): string[] {
    return this.conveyor.getAllCategories();
  }

  /**
   * Gets the description to be displayed of a specific category.
   * @param categoryId id of the category to get from.
   * @returns string description of a category type.
   */
  getCategoryDescription(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).description;
    }
  }

  /**
   * Gets the label to be displayed of a specific category.
   * @param categoryId id of the category to get from.
   * @returns string label of a category.
   */
  getCategoryLabel(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).label;
    }
  }

  /**
   * Gets the icon of a specific category to display on the page.
   * @param categoryId ihttps://prod.liveshare.vsengsaas.visualstudio.com/join?667FF9938C0EE2D0814F72F5AA0F61D9C99Fd of the category to get from.
   * @returns the project path to the icon image.
   */
  getCategoryIcon(categoryId: string): string {
    const baseUrl = this.cfg.getAssetUrl + 'flaticon/';
    return baseUrl + this.conveyor.getCategorySpec(categoryId).id + '.png';
  }

  /**
   * If the user selects a category, it is added to the conveyor and a new
   * datalist is created.
   * @param event MouseEvent object contains information about user click.
   * @param categoryId the string ID of the user-selected category.
   */
  addCategory(event: MouseEvent, categoryId: string): void {
    console.log("Hej vi väljer kategori nu!");
    let values;

    if (!this.conveyor.hasCategoryId(categoryId)) {
      this.conveyor.setDataList(
        categoryId,
        new DataList(this.conveyor.getCategorySpec(categoryId))
      );
    }
    if (!!localStorage.getItem(categoryId))
    {
      values = JSON.parse(localStorage.getItem(categoryId));  
    } else 
    {
      values = new Array
    }
    localStorage.setItem(categoryId, JSON.stringify(values));
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
// if (!!localStorage.getItem('destination_names')) {

/*
  addToLocalStorage(category: string, values: array): void {
    let values;
    if (!!localStorage.getItem(category)) {
      values = JSON.parse(localStorage.getItem(category));
    } else {
      values = new Array();
    }

    localStorage.setItem(category, JSON.stringify(values));
  }*/