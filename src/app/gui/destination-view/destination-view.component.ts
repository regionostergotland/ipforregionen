import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config.service';
import { Conveyor } from 'src/app/conveyor.service';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface DialogData {
  dest_name: string;
  dest_url: string;
}

export interface YesNo {
  yes: boolean;
}

@Component({
  selector: 'app-destination-view',
  templateUrl: './destination-view.component.html',
  styleUrls: ['./destination-view.component.scss']
})
export class DestinationViewComponent implements OnInit {

  destination_names: string[] = ['Region Ostergotland'];
  destination_urls: string[] = ['http://regionen.se'];
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

  ngOnInit() {
  }

  yeet(destination: string) {
    this.conveyor.setDestination(destination);
    this.router.navigateByUrl('/inspection');
  }
/*
  deleteDest(i: num) {
    this.destination_names.splice(i,1);
    this.destination_urls.splice(i,1);
  }*/

  openModal(): void {
    const dialogRef = this.dialog.open(NewDestinationDialog, {
      width: '250px',
      data: {dest_url: this.dest_url, dest_name: this.dest_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.destination_names.push(result.dest_name);
        this.destination_urls.push(result.dest_url);
      }
    });
  }

  openAlert(i: number): void {
    const dialogRef = this.dialog.open(NewAlertDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
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

  constructor(
    public dialogRef: MatDialogRef<NewDestinationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNewDest(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-custom-alert',
  templateUrl: './dialog-custom-alert.component.html',
})

export class NewAlertDialog {

  constructor(
    public dialogRef: MatDialogRef<NewAlertDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
