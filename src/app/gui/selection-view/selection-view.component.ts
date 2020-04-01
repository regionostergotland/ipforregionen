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

  constructor() { }

  file: File;

  ngOnInit() {
  }

  uploadToApp(file) : void{
    this.file = file.target.files[0];
    console.log(this.file.name);
    let result;

    let reader = new FileReader();
    reader.readAsText(this.file, "UTF-8");
    reader.onload = (evt: Event) => {
      result = reader.result;
      result = JSON.parse(result);
      console.log(typeof result);
      console.log(result);

      if (!!result["selections"]) {
        let selections = result["selections"];
        localStorage.setItem('selections_names', JSON.stringify(selections["name"]));
        localStorage.setItem('selections_ids', JSON.stringify(selections["id"]));
        localStorage.setItem('selections_destinations', JSON.stringify(selections["destinations"]));
        localStorage.setItem('destination_categories', JSON.stringify(selections["categories"]));
      }
    }    
  }

}
