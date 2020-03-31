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
      console.log('> Name:             ' + device.name);
      console.log('> Id:               ' + device.id);

      console.log('Connecting to GATT Server ...');
      const server = await device.gatt.connect();
      console.log('> Connected:        ' + device.gatt.connected);

      console.log('Getting Service...');
      const service = await server.getPrimaryService(serviceUuid);

      console.log('Getting Characteristics...');
      const characteristics = await service.getCharacteristics();

      console.log('> Characteristics: ' +
            characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19)));

      for (const characteristic of characteristics) {
        const descriptor = await characteristic.getDescriptors();
        console.log('> Descriptors: ' +
      descriptor.map(c => c.uuid).join('\n' + ' '.repeat(19)));
      }


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
