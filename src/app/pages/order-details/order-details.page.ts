import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { OrderViewModalPage } from 'src/app/pages/order-view-modal/order-view-modal.page';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  public orderNo: any;
  public orderDetailHeader: any;
  public bindata: boolean = false;
  public orderInvoice: any;
  constructor(private modelCtrl: ModalController, private menu: MenuController,
    private activatedroute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.orderNo = this.activatedroute.snapshot.paramMap.get('orderNo');
    console.log("orderDetailHeader", this.orderDetailHeader);

  }

  ngOnInit() {
    this.getOrderDetails();
  }

  ionViewDidEnter() {

  }

  getOrderDetails() {
    this.apiService.getDataService(this.apiService.getOrderDetail + '/' + this.orderNo).subscribe((response: any) => {
      console.log("response ", response);
      this.orderDetailHeader = response.ord_Header_BO;
      console.log('detail ', this.orderDetailHeader);
      this.bindata = true;
      this.getInvoiceData()
    }, (err) => {
      console.log("error ", err);
      this.commonService.showToast(err.message);
    })
  }

  getInvoiceData() {
    // this.apiService.getDataService(this.apiService.GetInvoiceDetailByOrderNo + '/' + this.orderNo).subscribe((response: any) => {
    //   console.log("response ", response);
    //   this.orderInvoice = response;
    // }, (err) => {
    //   console.log("error ", err);
    //   this.commonService.showToast(err.message);
    // })
  }

  async viewDetails() {
    const model = await this.modelCtrl.create({
      component: OrderViewModalPage,
      cssClass: 'my-custom-modal-css'
    })
    return await model.present();
  }
  savePressed() {

  }
}
