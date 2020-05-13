import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { CategorySpec } from 'src/app/ehr/datatype';
import { DataList } from '../../ehr/datalist';
import { Router } from '@angular/router';
import { Filter, filterString } from 'src/app/ehr/datalist';
import { Destination } from '../../destination.service';
import { ConfigService } from 'src/app/config.service';
import {
  Categories,
  CommonFields,
  MedicalDevice,
  BloodPressure,
  BodyWeight,
  Height,
  HeartRate
} from '../../ehr/ehr-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SELECT_PANEL_VIEWPORT_PADDING } from '@angular/material/select';

interface Selection {
  id: string;
  name: string;
  destinations: any[];
  categories: string[];
  filters: Map<string, Filter>;
  imageUrl: string;
}

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.scss']
})
export class SelectionViewComponent implements OnInit {
  selections: Selection[] = [];
  selectedSelections: Selection[] = [];

  categoryIds: string[] = [];

  destination: Destination;

  file: File;
  assetUrl: string;

  constructor(private conveyor: Conveyor,
    public router: Router,
    private snackBar: MatSnackBar,
    private cfg: ConfigService) {
      this.assetUrl = cfg.getAssetUrl();
   }

  ngOnInit() {
    this.getCategories();
    this.loadFromLocal();
  }

  AfterViewInit() : void {
  }

  /**
  * Fetches categories available in conveyor after
  * data is imported by user in step 1.
  */
  getCategories(): void {
    this.categoryIds = this.conveyor.getCategoryIds();
    for (const id of this.categoryIds) {
    }
  }

  getCategoryLabel(categoryId: string): string {
    return this.conveyor.getCategorySpec(categoryId).label;
}

/**
* Imports a valid JSON file and iterates through each selection object.
* For each selection object, an instance of the Selection interface is 
* created and saved to localstorage. 
* @param file A valid JSON file.
*/
  importSelection(file) : void{
    this.file = file.target.files[0];
    let result;

    let reader = new FileReader();
    reader.readAsText(this.file, "UTF-8");
    reader.onload = (evt: Event) => {
      result = reader.result;
      result = JSON.parse(result);

      if (!!result["selection"]) {
        for (let selection of result["selection"]){

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: selection["id"],
          name: selection["name"],
          destinations: selection["destinations"],
          categories: selection["categories"],
          filters: selection["filters"],
          imageUrl: this.cfg.getAssetUrl() + 'selection.png'
        };

        this.saveToLocal(currentSelection);

        // Adding currentSelection to member variable selections
        this.selections = [];
        this.loadFromLocal();
         
      }
    }
      else {
        console.log("This file is not a valid selection.");
      }
    }
  }

/*
* Uses imported selections stored in this.selections
* Retrieves the relevant values and filters
* and applies the filters to the values
*/

/**
 * Iterates through the list selectedSelections 
 * and runs executeSelection on each selection.
 * Creates a snackbar to indicate the action was succesful
 * and navigates to the the inspection page.
 */
  executeSelections() : void {
    for (let sel of this.selectedSelections){
      this.executeSelection(sel);
    }
    
    this.snackBar.open("Urval skapat!", null, {duration: 2000});
    this.router.navigateByUrl('/inspection');
  }

/**
 * Iterates through a selection's list of category id's. 
 * Checks if the category is present in the conveyor and if the
 * category has any data points. 
 * If the category exists and has at least one data point
 * all the filters in the selection will be applied 
 * to the category's data points to create a filtered data list.
 * Lastly, the data list and selection information is transferred
 * to an instance of the class Destination.
 *  
 * @param selection An instance of the interface Selection.
 */
  executeSelection(selection: Selection): void {
    for (let cat of selection.categories) {
      if (this.conveyor.hasCategoryId(cat)) {
        if (!this.conveyor.dataListIsEmpty(cat)) {
          let dataList = this.conveyor.getDataList(cat);

          for (let filter of selection.filters[cat]){
            dataList.addFilter(filter);
          }
          this.addDestinationData(cat, dataList, selection.destinations);
        } else {
          console.log("Category is empty and has not been imported");
        }
      } else {
        console.log("Category has not been imported");
      }
    }
  } 

/*
* Create destination objects for each destination and
* add each destination to the destination array in conveyor
*/

/**
 * 
 * @param category The category id.
 * @param data An instance of a DataList with a filter applied.
 * @param destinations A list of JSON objects.
 */
  addDestinationData(category : string, data : DataList,
    destinations: Object[]): void {

      destinations.forEach((destination, i) => {
        let dest_object : Destination;
        
        if(!this.conveyor.getDestinations().has(destination["url"]))
        {
          dest_object = new Destination(destination["name"],
           destination["url"], destination["needsAuth"]);
          } else {
          dest_object = this.conveyor.getDestinations()
          .get(destination["url"]);
        }
        dest_object.setDataList(category, data);
        this.conveyor.setDestination(dest_object);

        console.log("Destination object: ");
        console.log(dest_object);

      })
      console.log("Destination map: ");
      console.log(this.conveyor.getDestinations());
  }


  /*
  * Allows selecting one or more selections
  * that will then be handled with executeSelections()
  */
  selectSelection(selection: Selection, event: any) : void{
    const boxChecked: boolean = event.checked;
    if (boxChecked) {
      if (this.selectedSelections.indexOf(selection) === -1){
        this.selectedSelections.push(selection);
      }
    } else {
      this.selectedSelections.splice(this.selectedSelections.indexOf(selection), 1);
    }

        console.log(this.selectedSelections);

  }

   /*
   * Removes selection from page
   */
   removeSelection(selection: Selection): void {
     this.selections.splice(this.selections.indexOf(selection), 1);
     console.log(this.selections);
     this.updateLocal();
   }

   updateLocal(): void{
     localStorage.removeItem("selections");
     for (let selection of this.selections){
        this.saveToLocal(selection);
     }
   }
  /**
   * Saves selection to localstorage under "selections" if not already
   * present.
   * @param object selection
   */
  saveToLocal(selection: Selection) : void {
    let selections;
    if (!!JSON.parse(localStorage.getItem("selections"))) {
      selections = JSON.parse(localStorage.getItem("selections"));
    } else {
      selections = {};
    }

    if (!selections[selection.id]) {
      selections[selection.id] = selection;
      localStorage.setItem("selections", JSON.stringify(selections));
    }
  }

  /* 
  * Checks local storage for previously loaded selections
  * Called when page is loaded
  */
  loadFromLocal(): void {
    if (!!JSON.parse(localStorage.getItem("selections"))) {
      let result = JSON.parse(localStorage.getItem("selections"));

      for (let sel in result){
        let selection = result[sel];

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: selection["id"],
          name: selection["name"],
          //needsAuth : selection["needsAuth"],
          destinations: selection["destinations"],
          categories: selection["categories"],
          filters: selection["filters"],
          imageUrl: this.cfg.getAssetUrl() + 'selection.png'
        }

        console.log(currentSelection.name);
        // Adding currentSelection to selections
        this.selections.push(currentSelection);
      }
    }
  }
}


