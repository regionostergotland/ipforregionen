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

interface Selection {
  id: string;
  name: string;
  needsAuth: boolean;
  destinations: string[];
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
  selectedSelections: Selection[] = []; //Add Selection to this list when it is clicked on

  categoryIds: string[] = [];

  destination: Destination;

  file: File;

  constructor(private conveyor: Conveyor,
    public router: Router,
    private snackBar: MatSnackBar,
    private cfg: ConfigService) {
    console.log("Loaded selection view...");
   }

  ngOnInit() {
    //console.log("ngOnInit");
    this.getCategories();
    this.loadFromLocal();
  }

  AfterViewInit() : void {
    //console.log("AfterViewInit");
  }

  /**
  * Fetches categories available in conveyor after
  * Data is imported by user in step 1
  **/
  getCategories(): void {
    this.categoryIds = this.conveyor.getCategoryIds();
    for (const id of this.categoryIds) {
      console.log("cat: " + id);
    }
  }

/*
* Importing one selection at the time and saving it in
* member variable selections
*/
  importSelection(file) : void{
    this.file = file.target.files[0];
    // console.log("File uploaded is: " + this.file.name);
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
          needsAuth : selection["needsAuth"],
          destinations: selection["destinations"],
          categories: selection["categories"],
          filters: selection["filters"],
          imageUrl: this.cfg.getAssetUrl() + 'selection.png'
        };

        console.log(currentSelection.name);

        this.saveToLocal(currentSelection);

        // Adding currentSelection to member variable selections
        this.selections.push(currentSelection);
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
* And applies the filters to the values
*/
  executeSelections() : void {
    for (let sel of this.selectedSelections){
      this.executeSelection(sel);
    }
    
    this.snackBar.open("Urval skapat!", null, {duration: 2000});
    this.router.navigateByUrl('/inspection');
  }


  executeSelection(selection: Selection): void {
    for (let cat of selection.categories){
      // console.log("For cat: "+ cat);
      if(this.conveyor.hasCategoryId(cat)){
        let dataList = this.conveyor.getDataList(cat);

        for (let filter of selection.filters[cat]){
        //let filter: Filter = selection.filters[cat];
        //console.log("Filter:");
        //console.log(filter);)
        dataList.addFilter(filter);
        //console.log("Selection destination: ")
        //console.log(selection.destinations);
        }
        this.addDestinationData(selection.name, cat, dataList, selection.destinations,
           selection.needsAuth);
        //this.conveyor.setDestinationUrl(sel.destinations[0]);
      } else {
        console.log("Category has not been imported");
      }
    }
  }

/*
* Create destination objects for each destination and
* add each destination to the destination array in conveyor
*/
  addDestinationData(name : string, category : string, data : DataList,
    destinations: string[], needsAuth : boolean): void {

      destinations.forEach((value, i) => {
        let dest_object : Destination;

        if(!this.conveyor.getDestinations().has(value)){
          dest_object = new Destination(name, value, needsAuth);
            //console.log("Added destination to map");        
          } 
        else {
          dest_object = this.conveyor.getDestinations().get(value);
          //console.log("Destination already in map");
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

  removeFromLocal(selection: Selection): void{
    localStorage.removeItem("selections");
    let selections = {};
    if (!selections[selection.id]) {
      selections[selection.id] = selection;
      localStorage.setItem("selections", JSON.stringify(selections));
    }
  }

  loadFromLocal(): void {
    if (!!JSON.parse(localStorage.getItem("selections"))) {
      let result = JSON.parse(localStorage.getItem("selections"));

      for (let sel in result){
        let selection = result[sel];

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: selection["id"],
          name: selection["name"],
          needsAuth : selection["needsAuth"],
          destinations: selection["destinations"],
          categories: selection["categories"],
          filters: selection["filters"],
          imageUrl: this.cfg.getAssetUrl() + 'selection.png'
        };

        console.log(currentSelection.name);
        // Adding currentSelection to selections
        this.selections.push(currentSelection);
      };

  }
}


}




//    localStorage.setItem('destination_urls', JSON.stringify(urls));
