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
export class BluetoothService {

  constructor(
    private blt: BluetoothService
  ) {
    //super();
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

  public async signIn() {}
  public signOut(): void {}

  public getAvailable(): Observable<string[]>{
    return of(Array.from(this.implementedCategories.keys()));
  }

  public getData(categoryId: string,
                 start: Date, end: Date){

                 }
}
