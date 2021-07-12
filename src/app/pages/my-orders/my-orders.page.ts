import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { AlertModelComponent } from 'src/app/components/alert-model/alert-model.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  bgColor: any;
  myOrders: any = [];
  dataSearch: any;
  noOrdermsg: any;
  offset: any = 1;
  limit: any = 5;
  disable: any = false;
  constructor(private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private modal: ModalController) {

  }

  ngOnInit() {
    this.getMyOrders('');
  }

  showFilter() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: AlertModelComponent,
      cssClass: 'alert-custom-class',
      componentProps: {
        type: 'order'
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        console.log("data ", data);
        this.dataSearch = data.data;
        this.myOrders = [];
        this.offset = 1;
        this.disable = false;
        this.getMyOrders(this.dataSearch);
      });

    return await modal.present();
  }

  goToDetail(gskOrderNo) {
    this.router.navigate(["/order-details", { orderNo: gskOrderNo }]);
  }

  loadMore() {
    let lim = this.limit + this.offset;
    this.offset = lim;
    this.getMyOrders(this.dataSearch);
  }

  getMyOrders(data?: any) {

    var orderStart = '';
    var orderEnd = '';
    var orderStatus = 'ALL';
    var productCode = 'ALL';
    console.log("data ", data);
    if (data != undefined) {
      orderStart = data.startDate ? orderStart = data.startDate : '';
      orderEnd = data.endDate ? orderEnd = data.endDate : '';
      orderStatus = data.orderStatus ? orderStatus = data.orderStatus : 'ALL';
      productCode = data.productsData ? productCode = data.productsData : 'ALL';
      console.log("inside data ");
    }
    console.log("data ", data);
    this.commonService.showLoader();
    console.log("offset ", this.offset);
    console.log("limit ", this.limit);
    this.apiService.postDataService(this.apiService.myOrders, { "OrderStartDate": orderStart, "OrderEndDate": orderEnd, "OrderStatus": orderStatus, "productCode": productCode, "offset": this.offset, "limit": this.limit }).subscribe((response: any) => {
      this.commonService.hideLoader();
      if (response.code == "811" || response.code) {
        this.noOrdermsg = response.message;
        this.disable = true;
      } else {
        if (this.offset > 1) {
          response.gsk_Ord_Header_BO_List.map((ele: any) => {
            this.myOrders.push(ele);
          })
        } else {
          this.myOrders = response.gsk_Ord_Header_BO_List;
        }
        this.disable = false;
        console.log("my orders ", this.myOrders);
      }
    }, (err) => {
      console.log("error ", err);
      this.commonService.hideLoader();
      this.commonService.showToast(err.message);
    })
  }

}

