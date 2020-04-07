import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  settingsJSON: object = {};
  constructor() { }

  file: File;

  ngOnInit() {
  }

  saveToFile() : void{
    if (JSON.parse(localStorage.getItem("destination_names")).length > 0 
        && JSON.parse(localStorage.getItem("destination_urls")).length > 0) {
          let namesArray = JSON.parse(localStorage.getItem("destination_names"));
          let urlsArray = JSON.parse(localStorage.getItem("destination_urls"));
          let destinationsMap = {
            'names' : namesArray,
            'urls' : urlsArray
          };
          this.settingsJSON['destinations'] = destinationsMap;
    } else {
      alert("inga destinationer sparade!");
    }
    // blob = binary large object
    console.log(this.settingsJSON);
    
    console.log(JSON.stringify(this.settingsJSON));
    let blob = new Blob([JSON.stringify(this.settingsJSON)], 
                {type: "application/json;charset=utf-8"});
    let timeNow = Date.now();
    let timeForm = new Date(timeNow);
    let fileName = "backup_" + timeForm.toISOString() + ".json";

    saveAs(blob, fileName);
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

      if (!!result["destinations"]) {
        let destinations = result["destinations"];
        localStorage.setItem('destination_names', JSON.stringify(destinations["names"]));
        localStorage.setItem('destination_urls', JSON.stringify(destinations["urls"]));
      }
    }    
  }
}
