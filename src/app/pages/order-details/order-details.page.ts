import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CartModel } from 'src/app/Model/cart.model';
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
  public orderDetailInfo: any;
  public cartData: any;
  constructor(private modelCtrl: ModalController, private menu: MenuController,
    private activatedroute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router
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
      this.orderDetailInfo = response.order_Info_BO;
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
      cssClass: 'my-custom-modal-css',
      componentProps: {
        data: this.orderDetailHeader,
        detail: this.orderDetailInfo
      }
    })
    return await model.present();
  }
  savePressed() {
    let cartList: CartModel[] = [];
    this.orderDetailInfo.map(
      (ele) => {
        console.log("element ", ele);
        var cartProd = new CartModel();
        cartProd.productCode = ele.productCode;
        cartProd.productDescription = ele.productDescription;
        cartProd.productImage = ele.productImage;
        cartProd.quantity = Math.ceil(ele.quantity);
        cartProd.ptr = parseFloat(ele.productValue);
        cartList.push(cartProd);
      }
    );
    console.log("cartList ", cartList);
    this.router.navigate(['/order-summary', { stockiest: JSON.stringify(this.orderDetailHeader.stockistCerpCode), cartInfo: JSON.stringify(cartList), fromView: 'distributor', fromEvent: 'buyNow' }]);
  }
}
