import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/platform/bluetooth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Conveyor } from '../../conveyor.service';
import { Platform } from '../../platform/platform.service';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html'
})
export class BluetoothComponent implements OnInit {
  device: string;
  platform: Platform;
  private valuesAcquired: boolean = false;


  constructor(
    private conveyor: Conveyor,
    public dialogRef: MatDialogRef<BluetoothComponent>
  ) {
    this.device = ''
    this.platform = this.conveyor.getPlatform('bluetooth');
  }

  async pairDevice(){
    await this.conveyor.signIn('bluetooth');
    //this.device = this.platform.deviceName;
  }

  closeDialog(): void {
      this.dialogRef.close(this.valuesAcquired);
  }

  ngOnInit(): void {
  }

}
