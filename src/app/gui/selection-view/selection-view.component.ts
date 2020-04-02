import { Component, OnInit } from '@angular/core';

interface Selection {
  id: string;
  name: string;
  destinations: string[];
  categories: Map<string, string[]>;
}

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.scss']
})
export class SelectionViewComponent implements OnInit {
  selections: Selection[] = [];

  constructor() {
    console.log("Loaded selection view...");
   }

  file: File;

  ngOnInit() {
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

        // Preparing categories in a map
        let selectionCategories = selection["categories"];
        let categoryMap: Map<string, string[]> = new Map<string, string[]>();
        for (var key in selectionCategories) {
          categoryMap[key] = selectionCategories[key];
          console.log(key, categoryMap[key]);
        }

        // Making instance of interface Selection
        const currentSelection: Selection = {
          id: JSON.stringify(selection["id"]),
          name: JSON.stringify(selection["name"]),
          destinations: selection["destinations"],
          categories: categoryMap
        };

        // Adding currentSelection to member variable selections
        this.selections.push(currentSelection);

      }

      else {
        console.log("This file is not a valid selection.");
      }
    }
  }

}
