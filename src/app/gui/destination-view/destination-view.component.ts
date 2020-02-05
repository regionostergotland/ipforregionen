import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destination-view',
  templateUrl: './destination-view.component.html',
  styleUrls: ['./destination-view.component.scss']
})
export class DestinationViewComponent implements OnInit {

  Destinations: string[] = ['Valj Destination...', 'Region Ostergotland', 'PHR', 'Regionbois' ];

  constructor() { }

  ngOnInit() {
  }

}
