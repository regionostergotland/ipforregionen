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

  ngOnInit() {
  }

  saveToFile() {
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
}
