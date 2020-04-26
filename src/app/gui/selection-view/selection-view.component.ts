import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { CategorySpec } from 'src/app/ehr/datatype';
import { DataList } from '../../ehr/datalist';
import { Router } from '@angular/router';
import { Filter, filterString } from 'src/app/ehr/datalist';
import { Destination } from '../../destination.service';
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
}

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.scss']
})
export class SelectionViewComponent implements OnInit {
  selections: Selection[] = [];
  selectedSelection: Selection[] = []; //Add Selection to this list when it is clicked on

  categoryIds: string[] = [];

  destination: Destination;

  file: File;

  constructor(private conveyor: Conveyor,
    public router: Router,
    private snackBar: MatSnackBar) {
    console.log("Loaded selection view...");
   }

  ngOnInit() {
    console.log("ngOnInit");
    this.getCategories();
  }

  AfterViewInit() : void {
    console.log("AfterViewInit");
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
        // For now loading only one selection.

        for (let selection of result["selection"]){

        //let selection = result["selection"];
          // console.log("2 " + JSON.stringify(selection));

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: JSON.stringify(selection["id"]),
          name: JSON.stringify(selection["name"]),
          needsAuth : selection["needsAuth"],
          destinations: selection["destinations"],
          categories: selection["categories"],
          filters: selection["filters"]
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
    for (let sel of this.selections){
      this.executeSelection(sel);
    }
    this.snackBar.open("Urval skapat!", null, {duration: 2000});
  }


  executeSelection(selection: Selection): void {
    for (let cat of selection.categories){
      // console.log("For cat: "+ cat);
      if(this.conveyor.hasCategoryId(cat)){
        let dataList = this.conveyor.getDataList(cat);
        let filter: Filter = selection.filters[cat];
        //console.log("Filter:");
        //console.log(filter);
        dataList.addFilter(filter);
        //console.log("Selection destination: ")
        //console.log(selection.destinations);
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
  addDestinationData(name: string, category : string, data : DataList,
    destinations: string[], needsAuth :boolean): void {

      destinations.forEach((value, i) => {
        let dest_object : Destination;
        
        if(!this.conveyor.getDestinations().has(value)){
          dest_object = new Destination(name, value, needsAuth);
            console.log("Added destination to map");        } 
        else {
          dest_object = this.conveyor.getDestinations().get(value);
          console.log("Destination already in map");
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
  selectSelection() : void{

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
}


//    localStorage.setItem('destination_urls', JSON.stringify(urls));
