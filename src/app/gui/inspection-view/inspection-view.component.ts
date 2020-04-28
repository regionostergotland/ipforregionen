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
  destinationSent: Array<boolean>;

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
    this.destinationSent = new Array(this.destinations.length);
    this.destinationSent.fill(false);
    console.log(this.destinations);
  }

  hasDestination(): boolean {
    //return this.destination != null;
    return this.destinations != null;
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
  
  sendData(index: number): void {
    let destination = this.destinations[index];
    this.destinationSent[index] = true;
    this.conveyor.sendData(destination).
        subscribe(
          receipt => {
            this.dataSent = true && this.checkAllSent();
            this.receipt = receipt;
            if (this.dataSent) {
              this.conveyor.clearData();
            } else {
              this.snackBar.open("Data skickat till ${destination.getDestinationName}", "Ok", {duration: 3000});
            }
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
   * Checks if all destinations has sent the data
   */

  checkAllSent(): boolean {
    for (let i = 0; i < this.destinationSent.length; i++) {
      if (!this.destinationSent[i])
        return false;
    }
    return true;
  }
  
  /**
   * Checks if destination requires login
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
   */
  sendDataWithAuth(index: number): void {
    const dialogRef = this.dialog.open(LoginModal, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.conveyor.sendData(this.destinations[index]).
        subscribe(
          receipt => {
            this.dataSent = true;
            this.receipt = receipt;
            if (this.dataSent) {
              this.conveyor.clearData();
            } else {
              this.snackBar.open("Data skickat till" + this.destinations[index].getDestinationName, "Ok", {duration: 3000});
            }
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
      } else {
        this.snackBar.open("Datan är inte skickad", null, {duration: 3000});
      }
    });
  }
}
