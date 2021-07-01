import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  addNewProduct() {
    this.router.navigate(['product-list']);
  }

  continue() {
    this.router.navigate(['payment']);
  }

}
