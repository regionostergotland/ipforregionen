import { Injectable } from '@angular/core';
import { DataTypeEnum } from '../ehr/datatype';
import { DataPoint } from '../ehr/datalist';
import { EhrService } from '../ehr/ehr.service';
import { Platform } from './platform.service';
import { Observable, of } from 'rxjs';
import { Categories,
         CommonFields,
         HeartRate,
         MedicalDevice} from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService extends Platform {
  private device: BluetoothDevice;
  static GATT_PRIMARY_SERVICE = 'pulse_oximeter';

  constructor(
    private blt: BluetoothService
  ) {
    super();
    this.implementedCategories = new Map([
      [Categories.HEART_RATE, {
        url: '',
        dataTypes: new Map<string, any>([
          [CommonFields.TIME, null],
          [HeartRate.RATE, null],
        ])
      }]
    ]);

  }

  /**
  * Attempts to pair with a Bluetooth device
  */
  public async signIn() {
    this.pair();
  }



  public async pair() {
    // this can be made into a selector later for different devices
    let serviceUuid = ["pulse_oximeter"];
    try {
      console.log('Requesting Bluetooth Device ...')
      const device = await (window.navigator as any).bluetooth.requestDevice({
        // Filters to limit the pairing options showed
        filters: [{services: serviceUuid }],
        optionalServices: ['generic_access']
      });
      console.log(device);
      console.log('> DeviceName:             ' + device.name);
      console.log('> DeviceId:               ' + device.id);

      console.log('Connecting to GATT Server ...');
      const server = await device.gatt.connect();
      console.log('> Connected:        ' + device.gatt.connected);

      console.log('Getting Service...');
      const service = await server.getPrimaryService(serviceUuid);

      //this is a characteristic specific for pulse oximeters
      const characteristic = await service.getCharacteristic("plx_spot_check_measurement");
      console.log(characteristic);
      console.log('> Characteristic UUID:  ' + characteristic.uuid);
      console.log('> Broadcast:            ' + characteristic.properties.broadcast);
      console.log('> Read:                 ' + characteristic.properties.read);
      //console.log('> Write w/o response:   ' + characteristic.properties.writeWithoutResponse);
      //console.log('> Write:                ' + characteristic.properties.write);
      console.log('> Notify:               ' + characteristic.properties.notify);
      console.log('> Indicate:             ' + characteristic.properties.indicate);
      //console.log('> Signed Write:         ' + characteristic.properties.authenticatedSignedWrites);
      //console.log('> Queued Write:         ' + characteristic.properties.reliableWrite);
      //console.log('> Writable Auxiliaries: ' + characteristic.properties.writableAuxiliaries);

    } catch(error) {
      console.log('That did not work! ' + error);
    }
  }


  public signOut(): void {}

  public getAvailable(): Observable<string[]>{
    return of(Array.from(this.implementedCategories.keys()));
  }

  public getData(categoryId: string,
                 start: Date, end: Date): Observable<DataPoint[]> {

    const dataPoints: DataPoint[] = [];
    return of(dataPoints);

  }

}
