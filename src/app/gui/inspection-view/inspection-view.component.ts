import {Component,
        OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DataTypeEnum } from '../../ehr/datatype';
import { Conveyor } from '../../conveyor.service';
import { CompositionReceipt } from '../../ehr/ehr.service';
import { ConfigService } from 'src/app/config.service';
import { LoginModal } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { Destination } from '../../destination.service';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-inspection-view',
  templateUrl: './inspection-view.component.html',
  styleUrls: ['./inspection-view.component.scss']
})
export class InspectionViewComponent implements OnInit {
  dataTypeEnum = DataTypeEnum;

  dataSent = false;
  receipt: CompositionReceipt;
  destinations: Array<Destination>;

  constructor(
    public router: Router,
    private cfg: ConfigService,
    private snackBar: MatSnackBar,
    private conveyor: Conveyor,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSent = false;
    let destinations = this.conveyor.getDestinations();
    this.destinations = Array.from(destinations.values());
    console.log(this.destinations);
  }

  hasDestinations(): boolean {
    if(this.destinations.length > 0){
      return true;
    }
    return false;
  }

  hasData(): boolean {
    const categories = this.conveyor.getCategoryIds();
    if (categories.length > 0) {
      for (const cat of categories) {
        if (!this.isCategoryEmpty(cat)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if a category is empty.
   * @param categoryId the category to check values from.
   * @returns whether the category has no points in its list.
   */
  isCategoryEmpty(categoryId: string): boolean {
    if (this.conveyor.getDataList(categoryId)) {
      return this.getNumberOfValues(categoryId) < 1;
    }
    return false;
  }

  /**
   * Get the number of values in a chosen category.
   * @param category the category to get values from
   * @returns the number of values in the chosen category
   */
  getNumberOfValues(category: string): number {
    let values = 0;
    const pointMap = this.conveyor.getDataList(category).getPoints();
    for (const points of pointMap.values()) {
      values += points.length;
    }
    return values;
  }

  /**
   * Sends data to a destination and clears itself from conveyor.
   * @param index A number representing a selection.
   * 
   * ngOnInit is a bit hacky? Maybe change to more reasonable update?
   */
  sendData(index: number, dest: Destination = null): void {
    let destination: Destination;
    if (index !== null) {
      destination = this.destinations[index];
    } else {
      destination = dest;
    }
    this.conveyor.sendData(destination).
        subscribe(
          receipt => {
            this.receipt = receipt;
            let snackbarText = "Data skickat till " + destination.getDestinationName();
            this.snackBar.open(snackbarText, "Ok", {duration: 3000});
            this.conveyor.removeDestination(destination.getDestinationUrl());

            if (!!receipt.compUid && this.cfg.getIsDebug()) {
              this.snackBar.dismiss();
              this.snackBar.open("CompositionID=" + receipt.compUid, "Ok");
            }

            let destinations = this.conveyor.getDestinations();
            this.destinations = Array.from(destinations.values());
          },
          e => {
            console.log(e);
            if (this.cfg.getIsDebug()) { console.log(e); }
            this.snackBar.open(
              'Inrapporteringen misslyckades. Fel: "' + e.statusText + '"', null,
              { duration: 5000 }
            );
          }
      );
  }
  
  /**
   * Checks if destination requires login
   * @param index A number representing a selection
   * @returns true | false
   */
  needsAuth(index: number): boolean {
    return this.destinations[index].getAuth();
  }

    /**
   * Checks if destination requires login
   * @param dest A destination to retrieve keys from
   * @returns the chosen destination's key.
   */
  getDestCategories(dest: Destination): string [] { 
    return Array.from(dest.getCategories().keys()); 
  }

  /**
   * Send all the data stored in the conveyor if log in is required.
   * Uses "sendData" because except for loginModal they are identical.
   */
  sendDataWithAuth(dest: Destination): any {
    const dialogRef = this.dialog.open(LoginModal, {
      width: '250px',
      data: {destination_name: dest.getDestinationName()}
    });
      console.log(dest.getDestinationUrl());
    return dialogRef.afterClosed().pipe(tap(result => {
      if (result === true) {
        this.sendData(null, dest);
      }
    })).toPromise();
  }

  /**
   * Sends all available selection-data to respective destination.
   * Sends data that doesn't need login first, so that it can run async on the ones that needs
   * login to function properly.
   * 
   * For now only one authorisation per selection is possible, maybe expand in future?
   */
  async sendAll() {
    for (let i = 0; i < this.destinations.length; i++) {
      if (!this.needsAuth(i)) {
        this.sendData(i);
      }
    }
    for (let i = 0; i < this.destinations.length; i++) {
      if (this.needsAuth(i)) {
        let dest = this.destinations[i];
        await this.sendDataWithAuth(dest);
      }
    }
  }
}
