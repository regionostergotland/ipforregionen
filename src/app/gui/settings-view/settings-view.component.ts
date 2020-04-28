import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  settingsJSON: object = {};
  constructor(private _snackBar: MatSnackBar) { }

  file: File;

  ngOnInit() {
  }

  saveToFile() : void{
    // Add destination to json if is saved in localstorage
    if (!!JSON.parse(localStorage.getItem("destination_names")) 
        && !!JSON.parse(localStorage.getItem("destination_urls"))) {
          let namesArray = JSON.parse(localStorage.getItem("destination_names"));
          let urlsArray = JSON.parse(localStorage.getItem("destination_urls"));
          let destinationsMap = {
            'names' : namesArray,
            'urls' : urlsArray
          };
          this.settingsJSON['destinations'] = destinationsMap;
    } else {
      this._snackBar.open("Inga destinationer sparade!", null, {duration: 2000});
    }

    if(!!JSON.parse(localStorage.getItem("selections"))){
      let selectionObj = JSON.parse(localStorage.getItem("selections"));
      this.settingsJSON['selection'] = selectionObj;
    } else {
      this._snackBar.open("Inga urval sparade!", null, {duration: 2000});
    }

    // blob = binary large object
    let blob = new Blob([JSON.stringify(this.settingsJSON)], 
                {type: "application/json;charset=utf-8"});
    let timeNow = Date.now();
    let timeForm = new Date(timeNow);
    let fileName = "backup_" + timeForm.toISOString() + ".json";

    /**
     * TODO:
     * Fixa så den subscribear på onDone och öppnar en snackBar.
     */
    saveAs(blob, fileName);
    //this._snackBar.open("Data sparad", null, {duration: 5000});
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
      if (!!result["selections"]) {
        let selections = JSON.stringify(result["selections"]);
        localStorage.setItem('selections', selections);
      }

      this._snackBar.open("Data återställd!", null, {duration: 5000});
    }    
  }
}
