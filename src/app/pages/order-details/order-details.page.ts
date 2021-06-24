import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  selectChange(e) {
    console.log('stepper event ', e);
  }
}
