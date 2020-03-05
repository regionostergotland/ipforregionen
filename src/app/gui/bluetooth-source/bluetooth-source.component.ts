import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bluetooth-source',
  templateUrl: './bluetooth-source.component.html',
  styleUrls: ['./bluetooth-source.component.scss']
})
export class BluetoothSourceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getInfoDemo() {
    console.log('Requesting Bluetooth Device ...');
    (window.navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access']
    })
    .then(device => {
      console.log('> Name:             ' + device.name);
      console.log('> Id:               ' + device.id);
      console.log('> Connected:        ' + device.gatt.connected);
    })
    .catch(error => {
      console.log('Åh nej! ' + error);
    })

  }

}
