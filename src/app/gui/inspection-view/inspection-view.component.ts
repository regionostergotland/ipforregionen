import {Component,
        OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DataTypeEnum } from '../../ehr/datatype';
import { Conveyor } from '../../conveyor.service';
import { CompositionReceipt } from '../../ehr/ehr.service';
import { ConfigService } from 'src/app/config.service';
import { LoginModal } from './login-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-inspection-view',
  templateUrl: './inspection-view.component.html',
  styleUrls: ['./inspection-view.component.scss']
})
export class InspectionViewComponent implements OnInit {
  dataTypeEnum = DataTypeEnum;

  dataSent = false;
  receipt: CompositionReceipt;
  destination: string;

  constructor(
    public router: Router,
    private cfg: ConfigService,
    private snackBar: MatSnackBar,
    private conveyor: Conveyor,
    public dialog: MatDialog
  ) {
    this.destination = this.conveyor.getDestination();
  }

  ngOnInit() {
    this.dataSent = false;
  }

  hasDestination(): boolean {
    return this.destination != null;
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
  
  sendData(): void {
    this.conveyor.sendData().
        subscribe(
          receipt => {
            console.log(receipt);
            this.dataSent = true;
            this.receipt = receipt;
            this.conveyor.clearData();
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
   * @returns true | false
   */
  needsAuth(): boolean {
    return this.conveyor.getDestinationAuth();
  }

  /**
   * Send all the data stored in the conveyor if log in is required.
   */
  sendDataWithAuth(): void {
    const dialogRef = this.dialog.open(LoginModal, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.conveyor.sendData().
        subscribe(
          receipt => {
            console.log(receipt);
            this.dataSent = true;
            this.receipt = receipt;
            this.conveyor.clearData();
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
