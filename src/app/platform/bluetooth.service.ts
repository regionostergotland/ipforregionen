import { EventEmitter, Injectable } from '@angular/core';
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

  bluetooth: Bluetooth;
  //device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  characteristic: BluetoothCharacteristicUUID;
  navigator: Navigator;


  static GATT_PRIMARY_SERVICE = 'pulse_oximeter';

  constructor() {
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
  async signIn() {
    let device: BluetoothDevice;
    device = await this.requestDevice();
    this.server = await this.connectDevice(device);
    //this.pair();
  }

  async requestDevice(): Promise<BluetoothDevice> {
    console.log("[*] Requesting Bluetooth Device...");
    this.bluetooth = navigator.bluetooth;

    return this.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["pulse_oximeter"]
    });

  }

  async connectDevice(device: BluetoothDevice): Promise<BluetoothRemoteGATTServer> {
    if (device) {
      console.log("[*] Connecting to device..." + device.name);

      try {
        const server = await device.gatt.connect();
        console.log("[*] Connected to device!");
        return server;
      } catch (error) {
        Promise.reject(error);
      }
    } else {
      console.error("[X] Could not connect to device.");
    }
  }

async getCharacteristic(){}
 async getValue() {

 }


/*
  public async pair() {
    // this can be made into a selector later for different devices
    let serviceUuid = ["pulse_oximeter"];
    try {
      console.log('Requesting Bluetooth Device ...')
      const device = await (window.navigator as any).bluetooth.requestDevice({
        // Filters to limit the pairing options showed
        acceptAllDevices: true,
        //filters: [{services: serviceUuid }],
        optionalServices: [serviceUuid]
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
      let characteristic = await service.getCharacteristic("plx_continuous_measurement");

      console.log(characteristic);

      console.log('> Characteristic UUID:  ' + characteristic.uuid);
      console.log('> Broadcast:            ' + characteristic.properties.broadcast);
      console.log('> Read:                 ' + characteristic.properties.read);
      console.log('> Write w/o response:   ' + characteristic.properties.writeWithoutResponse);
      console.log('> Write:                ' + characteristic.properties.write);
      console.log('> Notify:               ' + characteristic.properties.notify);
      console.log('> Indicate:             ' + characteristic.properties.indicate);
      console.log('> Signed Write:         ' + characteristic.properties.authenticatedSignedWrites);
      console.log('> Queued Write:         ' + characteristic.properties.reliableWrite);
      console.log('> Writable Auxiliaries: ' + characteristic.properties.writableAuxiliaries);

      //let value = await characteristic.readValue();
      //console.log("> Value is " +  value.getUint8(0) + ".");

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged',
            this.handleValueChanged);

      console.log("We're done");
      //await characteristic.stopNotifications();
    } catch(error) {
      console.log('That did not work! ' + error);
    }
  }*/

  handleValueChanged(event) {
    let value = event.target.value.getUint8(0);
    console.log('> Value is ' + value + '.');

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
