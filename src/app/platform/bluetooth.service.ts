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
    console.log('Requesting Bluetooth Device ...');
    (window.navigator as any).bluetooth.requestDevice({
      // a filter can be applied here instead
      acceptAllDevices: true,
      optionalServices: ['generic_access']
    })
    .then(device => {
      console.log('> Name:             ' + device.name);
      console.log('> Id:               ' + device.id);
      console.log('Connecting to GATT Server ...');
      return device.gatt.connect();
    })
    .then(service => {
      console.log('Getting Characteristics ...');
      return service.getCharacteristics();
    })
    .then(characteristics => {
      console.log('> Characteristics: ' +
        characteristics.map(c => c.uuid).join('\n' + ''.repeat(19)));
    })
    .catch(error => {
      console.log('That did not work! ' + error);
    });
  }

  private pairSuccessHandler(){}

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
