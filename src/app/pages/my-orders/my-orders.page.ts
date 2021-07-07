import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  bgColor: any;
  myOrders: any;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getMyOrders();
  }

  goToDetail() {
    this.router.navigate(["/order-details"]);
  }

  getMyOrders() {
    this.apiService.getDataService(this.apiService.myOrders).subscribe((response: any) => {
      console.log("my orders ", response);
      this.myOrders = response;
    })
  }

}
