import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/platform/bluetooth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html'
})
export class BluetoothComponent implements OnInit {
  private valuesAcquired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BluetoothComponent>
  ) { }

  closeDialog(): void {
      this.dialogRef.close(this.valuesAcquired);
  }

  ngOnInit(): void {
  }

}
