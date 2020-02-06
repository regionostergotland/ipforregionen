import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config.service';
import { Conveyor } from 'src/app/conveyor.service';

@Component({
  selector: 'app-destination-view',
  templateUrl: './destination-view.component.html',
  styleUrls: ['./destination-view.component.scss']
})
export class DestinationViewComponent implements OnInit {

  Destinations: string[] = ['Region Ostergotland', 'PHR', 'Regionbois' ];
  assetUrl: string;
  defaultText: string = "Välj destination...";
  selection: string = this.defaultText;

  constructor(private cfg: ConfigService,
        private conveyor: Conveyor,
        public router: Router) {
      this.assetUrl = cfg.getAssetUrl();
  }

  ngOnInit() {
  }

  yeet(destination: string) {
    this.conveyor.setDestination(destination);
    this.router.navigateByUrl('/inspection');
  }
}
