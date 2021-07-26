import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CartModel } from 'src/app/Model/cart.model';
import { Product } from 'src/app/Model/product.model';
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
    
  }

  ngOnInit() {
    this.getOrderDetails();
  }

  ionViewDidEnter() {

  }

  getOrderDetails() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.getOrderDetail + '/' + this.orderNo).subscribe((response: any) => {
     
      this.orderDetailHeader = response.ord_Header_BO;
      this.orderDetailInfo = response.order_Info_BO;
      console.log("details :",response);
      this.bindata = true;
      this.commonService.hideLoader()
      this.getInvoiceData()
    }, (err) => {
      this.commonService.showToast(err.message);
      this.commonService.hideLoader();
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


  reorderPressed(){
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.getDistributorProduct, { StockistCerpCode: this.orderDetailHeader.stockistCerpCode }).subscribe(
      (response) => {
        console.log("response list :",response);
       const dProduct = response.distributorList as Product[];
       let cartList: CartModel[] = [];
       this.orderDetailInfo.map(
         (ele) => {

          dProduct.map(
            (innerEle) => {
          if(ele.productCode === innerEle.productCode){   
          var cartProd = new CartModel();
           cartProd.productCode = innerEle.productCode;
           cartProd.productDescription = innerEle.productDescription;
           cartProd.productImage = '';
           cartProd.quantity = parseInt(ele.quantity);
           cartProd.ptr = parseFloat(innerEle.ptr);
           cartProd.stockiestRate = innerEle.stokiestRate;
           cartList.push(cartProd);
            }
          }
          );
            }
       );
       this.commonService.hideLoader();
       const stockiestObj = {
        "preference":this.orderDetailHeader.preference,
        "stockistCerpCode":this.orderDetailHeader.stockistCerpCode,
        "stkName":this.orderDetailHeader.stkName
      }
      if(cartList?.length > 0){
        this.router.navigate(['/order-summary', { stockiest: JSON.stringify(stockiestObj), cartInfo: JSON.stringify(cartList), fromView: 'distributor', fromEvent: 'buyNow' }]);
      }
      },
      (error) => {
        this.commonService.hideLoader();
        this.commonService.showToast(error);
      }
    )
  }
}
