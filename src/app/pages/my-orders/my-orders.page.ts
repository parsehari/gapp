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

  goToDetail(gskOrderNo) {
    this.router.navigate(["/order-details", { orderNo: gskOrderNo }]);
  }

  getMyOrders() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.myOrders).subscribe((response: any) => {
      this.commonService.hideLoader();
      this.myOrders = response.gsk_Ord_Header_BO_List;
      console.log("my orders ", this.myOrders);
    }, (err) => {
      console.log("error ", err);
      this.commonService.showToast(err.message);
    })
  }

}

