import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { CategorySpec } from 'src/app/ehr/datatype';
import { DataList } from '../../ehr/datalist';
import { Router } from '@angular/router';
import {
  Categories,
  CommonFields,
  MedicalDevice,
  BloodPressure,
  BodyWeight,
  Height,
  HeartRate
} from '../../ehr/ehr-config';

interface Selection {
  id: string;
  name: string;
  destinations: string[];
  categories: Category[];
}

interface Category {
  dataType: string;
  filter: string[];
}

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.scss']
})
export class SelectionViewComponent implements OnInit {
  selections: Selection[] = [];
  selectedSelection: Selection[] = []; //Add Selection to this list when it is clicked on
  categorySpec: CategorySpec;
  implementedCategory: Category;
  implementedCategories: Category[];
  categories: [string, string][] = [];
  categoryIds: string[] = [];
  categoryMap: Map<string, boolean>;

  private platformId = '';

  file: File;


  constructor(private conveyor: Conveyor,
    public router: Router) {
    console.log("Loaded selection view...");
    
   }


  ngOnInit() {
    console.log("ngOnInit");
    this.platformId = 'dummy';
    this.categoryMap = new Map<string, boolean>();
    this.conveyor.getAvailableCategories(this.platformId).subscribe(res => {
    this.categoryIds = res;
    this.getCategories();
    });
  }

  AfterViewInit() : void {
    console.log("AfterViewInit");
    /*let tmpCat : string[];
    tmpCat = this.conveyor.getCategoryIds();
    for (let i=0; i < tmpCat.length; i++){
      console.log(tmpCat[i]);

    }*/
  }
  getCategories(): void {
    console.log("Get Cats");
    let cat: CategorySpec;
    for (const id of this.categoryIds) {
      console.log("cat: " + id);
      cat = this.conveyor.getCategorySpec(id);
      this.categories.push([id, cat.label]);
      this.categoryMap.set(id, false);
    }
  }

  importSelection(file) : void{
    this.file = file.target.files[0];
    console.log("File uploaded is: " + this.file.name);
    let result;

    let reader = new FileReader();
    reader.readAsText(this.file, "UTF-8");
    reader.onload = (evt: Event) => {
      result = reader.result;
      result = JSON.parse(result);

      if (!!result["selections"]) {

        // For now loading one selection. Can easily be made into loop for more.
        let selection = result["selections"][0];
        console.log("2 " + selection);

        // Preparing categories in an array
        let selectionCategories = selection["categories"];
        let tmpCategories : Category[] = [];

        for (var key in selectionCategories) {
          const category: Category = {
            dataType: key,
            filter: selectionCategories[key]
          }
          tmpCategories.push(category);
          console.log(category.dataType);
          console.log(category.filter);
        }

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: JSON.stringify(selection["id"]),
          name: JSON.stringify(selection["name"]),
          destinations: selection["destinations"],
          categories: tmpCategories
        };

        // Adding currentSelection to member variable selections
        this.selections.push(currentSelection);

      }

      else {
        console.log("This file is not a valid selection.");
      }
    }
  }

  // [sel, sel, sel]

  executeSelections() : void {
    let tmpCat : string[];
    tmpCat = this.conveyor.getCategoryIds();
    //for (let i=0; i < tmpCat.length; i++){
      console.log("Tmpcat: " + tmpCat);
    //}
    let tmp : DataList;

    for (let sel of this.selections){
      for (let cat in sel.categories){
           tmp =this.conveyor.getDataList(cat);
           for (let entry of tmp.getPoints().entries())
           {
             console.log(entry[1]);
           }
      }
    }
  }

  selectSelection(){

  }

}
