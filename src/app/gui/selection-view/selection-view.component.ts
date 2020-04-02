import { Component, OnInit } from '@angular/core';

interface Selection {
  id: number;
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
      console.log(typeof result);
      console.log("1 " + result["selections"]);

      if (!!result["selections"]) {
        let selection = result["selections"][0];
        console.log("2 " + selection);
        localStorage.setItem('selections_names', JSON.stringify(selection["name"]));
        localStorage.setItem('selections_ids', JSON.stringify(selection["id"]));
        localStorage.setItem('selections_destinations', JSON.stringify(selection["destinations"]));
        localStorage.setItem('selection_categories', JSON.stringify(selection["categories"]));
      }

      else {
        console.log("This file is not a valid selection.");
      }
    }
  }

}
