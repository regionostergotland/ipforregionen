import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
// import { CategorySpec } from 'src/app/ehr/datatype';
import { DataList } from '../../ehr/datalist';
import { Router } from '@angular/router';
import { Filter, filterString } from 'src/app/ehr/datalist';
import { Destination } from '../../destination.service';
import { ConfigService } from 'src/app/config.service';
// import {
//   Categories,
//   CommonFields,
//   MedicalDevice,
//   BloodPressure,
//   BodyWeight,
//   Height,
//   HeartRate
// } from '../../ehr/ehr-config';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { SELECT_PANEL_VIEWPORT_PADDING } from '@angular/material/select';

interface Selection {
  id: string;
  name: string;
  //needsAuth: boolean;
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
  selectedSelections: Selection[] = []; //Add Selection to this list when it is clicked on

  categoryIds: string[] = [];

  destination: Destination;

  file: File;
  assetUrl: string;

  constructor(private conveyor: Conveyor,
    public router: Router,
    private snackBar: MatSnackBar,
    private cfg: ConfigService) {
      this.assetUrl = cfg.getAssetUrl();
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

  getCategoryLabel(categoryId: string): string {
    return this.conveyor.getCategorySpec(categoryId).label;
}

/*
* Importing one selection at the time and saving it in
* member variable selections
*/
  importSelection(file: { target: { files: File[]; value: string; }; }) : void{
    console.log("yeet");
    this.file = file.target.files[0];
    // console.log("File uploaded is: " + this.file.name);
    let res: any;

    let reader = new FileReader();
    reader.readAsText(this.file, "UTF-8");

    reader.onerror = (_evt: any) => {
      reader.abort();
    }

    console.log(file);

    reader.onloadend = (evt) => {
      res = evt.target.result;
      res = JSON.parse(res);

      /**
       * rensa input#file så vi kan ladda upp samma fil flera gånger
       * utan att behöva ladda upp en annan fil emellan
       */
      file.target.value = "";  

      if (!!res["selection"]) {
        for (let selection of res["selection"]){

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
          console.log(this.selections);
        }
      } else {
        console.log("This file is not a valid selection.");
      }
    }
  }

/*
* Uses imported selections stored in this.selections
* Retrieves the relevant values and filters
* and applies the filters to the values
*/
  executeSelections() : void {
    for (let sel of this.selectedSelections){
      this.executeSelection(sel);
    }
    
    this.snackBar.open("Urval skapat!", null, {duration: 2000});
    this.router.navigateByUrl('/inspection');
  }


  executeSelection(selection: Selection): void {
    for (let cat of selection.categories) {
      if (this.conveyor.hasCategoryId(cat)) {
        if (!this.conveyor.dataListIsEmpty(cat)) {
          let dataList = this.conveyor.getDataList(cat);

          for (let filter of selection.filters[cat]){
            dataList.addFilter(filter);
          }
          this.addDestinationData(selection.name, cat, dataList, selection.destinations);
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
  addDestinationData(name : string, category : string, data : DataList,
    destinations: Object[]): void {

      destinations.forEach((destination, i) => {
        let dest_object : Destination;
        
        if(!this.conveyor.getDestinations().has(destination["url"]))
        {
          dest_object = new Destination(destination["name"],
           destination["url"], destination["needsAuth"]);
            //console.log("Added destination to map");
          } else {
          dest_object = this.conveyor.getDestinations()
          .get(destination["url"]);
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
    let selections = this.selectedSelections;
    if (boxChecked) {
      if (selections.indexOf(selection) === -1){
        selections.push(selection);
      }
    } else {
      selections.splice(selections.indexOf(selection), 1);
    }
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
    let selections: {};
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


//    localStorage.setItem('destination_urls', JSON.stringify(urls));
