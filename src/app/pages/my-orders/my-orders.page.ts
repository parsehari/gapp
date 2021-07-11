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
  myOrders: any;
  dataSearch: any;
  constructor(private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private modal: ModalController) {

  }

  ngOnInit() {
    this.getMyOrders();
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
        this.dataSearch = data;
        this.filterList(this.dataSearch);
      });

    return await modal.present();
  }

  goToDetail(gskOrderNo) {
    this.router.navigate(["/order-details", { orderNo: gskOrderNo }]);
  }

  filterList(search) {

  }

  getMyOrders() {
    var startdate = moment().format("DD-MM-YYYY");
    var enddate = moment().subtract(6, "months").format('DD-MM-YYYY');

    console.log("start date :", startdate);
    console.log("end date :", enddate);
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.myOrders, { "OrderStartDate": '', "OrderEndDate": '', "OrderStatus": 'All' }).subscribe((response: any) => {
      this.commonService.hideLoader();
      this.myOrders = response.gsk_Ord_Header_BO_List;
      console.log("my orders ", this.myOrders);
    }, (err) => {
      console.log("error ", err);
      this.commonService.hideLoader();
      this.commonService.showToast(err.message);
    })
  }

}

