import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config.service';
import { Conveyor } from 'src/app/conveyor.service';

import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';

export interface DialogData {
  dest_name: string;
  dest_url: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid);
  }
}

@Component({
  selector: 'app-destination-view',
  templateUrl: './destination-view.component.html',
  styleUrls: ['./destination-view.component.scss']
})
export class DestinationViewComponent implements OnInit {

  destination_names: string[] = ['Region Ostergotland'];
  destination_urls: string[] = ['https://rest.ehrscape.com/rest/v1/'];
  assetUrl: string;
  defaultText: string = "Välj destination...";
  selection: string = this.defaultText;

  name: string;
  dest_url: string;
  dest_name: string;

  constructor(private cfg: ConfigService,
        private conveyor: Conveyor,
        public router: Router,
        public dialog: MatDialog) {
      this.assetUrl = cfg.getAssetUrl();
  }


    /**
   * Checks local storage for previously saved destinations
   */
  ngOnInit() {
    if (!!localStorage.getItem('destination_names')) {
      let names = localStorage.getItem('destination_names');
      this.destination_names = this.destination_names.concat(JSON.parse(names));
    }

    if (!!localStorage.getItem('destination_urls')) {
      let urls = localStorage.getItem('destination_urls');
      this.destination_urls = this.destination_urls.concat(JSON.parse(urls));
    }
  }

    /**
   * Moves us on to the next step when user deems itself done
   * @param destination Destination chosen by user
   */
  continue(destination: string): void {
    let index = this.destination_names.indexOf(destination);
    let url = this.destination_urls[index];
    this.conveyor.setDestination(destination);
    this.conveyor.setDestinationUrl(url);
    this.router.navigateByUrl('/inspection');
  }


    /**
   * Adds user destinations to personal local storage
   * @param name Name of the destination, provided by user
   * @param url Destination URL, provided by user
   */
  addToLocalStorage(name: string, url: string): void {
    let names: any[];
    let urls: any[];
    if (!!localStorage.getItem('destination_names')) {
      names = JSON.parse(localStorage.getItem('destination_names'));
    } else {
      names = new Array();
    }

    if (!!localStorage.getItem('destination_urls')) {
      urls = JSON.parse(localStorage.getItem('destination_urls'));
    } else {
      urls = new Array();
    }
    names.push(name);
    urls.push(url);

    localStorage.setItem('destination_names', JSON.stringify(names));
    localStorage.setItem('destination_urls', JSON.stringify(urls));
  }


    /**
   * Removes a user added destination from local storage
   * @param index index in destination_names and destination_urls
   */
  deleteFromLocalstorage(index: number): void {
    let names;
    let urls;
    if (!!localStorage.getItem('destination_names')) {
      names = JSON.parse(localStorage.getItem('destination_names'));
    }

    if (!!localStorage.getItem('destination_urls')) {
      urls = JSON.parse(localStorage.getItem('destination_urls'));
    }

    names.splice((index-1), 1);
    urls.splice((index-1), 1);

    localStorage.setItem('destination_names', JSON.stringify(names));
    localStorage.setItem('destination_urls', JSON.stringify(urls));
  }


    /**
   * Opens modal to add new destinations
   * Adds user input to destination_names and destination_urls
   * Saves destination to local storage
   */
  openModal(): void {
    const dialogRef = this.dialog.open(NewDestinationDialog, {
      width: '250px',
      data: {dest_url: this.dest_url, dest_name: this.dest_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToLocalStorage(result.dest_name,result.dest_url);
        this.destination_names.push(result.dest_name);
        this.destination_urls.push(result.dest_url);
      }
    });
  }

    /**
   * Opens alert to delete destinations
   * Removes destination from local storage
   * Removes destination from destination_names and destination_urls
   * @param i index of destination to handle in destination_names and destination_urls
   */
  openAlert(i: number): void {
    const dialogRef = this.dialog.open(NewAlertDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.delete) {
        this.deleteFromLocalstorage(i);
        this.destination_names.splice(i,1);
        this.destination_urls.splice(i,1);
      }
    });
  }
}


@Component({
  selector: 'dialog-custom-destination',
  templateUrl: './dialog-custom-destination.component.html',
})

export class NewDestinationDialog {
  destinationFormControl: Map<string, FormControl>;
  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<NewDestinationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.destinationFormControl = new Map<string, FormControl>();
    }

  /**
   * Closes dialog when user presses no
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Checks if paramter exists as a key in destinationFormControl
   * Adds to destinationFormControl if false
   * @param key 'name' or 'url'
   * @returns the value behind 'key' in the map
   */
  getFormControl(key: string): FormControl {
    if (!this.destinationFormControl.has(key)) {
      this.destinationFormControl.set(
        key,
        new FormControl('',
        [Validators.required])
      );
    }
    return this.destinationFormControl.get(key)
  }
}

@Component({
  selector: 'dialog-custom-alert',
  templateUrl: './dialog-custom-alert.component.html',
})

export class NewAlertDialog {

  constructor(
    public dialogRef: MatDialogRef<NewAlertDialog>) {}

  /**
   * Closes dialog when user presses no
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
