import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export class ErrorPagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'app-error-pages',
  templateUrl: './fourfour-page.component.html',
  styleUrls: ['./fourfour-page.component.sass']
})
export class FourFourPageComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }
}


@Component({
  selector: 'app-error-pages',
  templateUrl: './fiveoh-page.component.html',
  styleUrls: ['./fiveoh-page.component.sass']
})
export class FiveOhPageComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}

