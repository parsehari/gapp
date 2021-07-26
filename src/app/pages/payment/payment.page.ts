import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartDetails } from 'src/app/Model/cart-details.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  providers: [DatePipe]
})
export class PaymentPage implements OnInit {
  public cartData: any;
  public netPrice: any;
  public stockiestObj: any;
  public orderDate: any;
  public Summarydata: any;
  public stockiestID: any;
  badgeCount = this.commonService.badgeCountValue;
  constructor(private activatedroute: ActivatedRoute, private commonService: CommonService,
    private storageService: StorageService, private apiService: ApiService, private route: Router, private datePipe: DatePipe) {
    this.cartData = this.activatedroute.snapshot.paramMap.get('products');
    this.netPrice = this.activatedroute.snapshot.paramMap.get('netPrice');
    this.stockiestObj = this.activatedroute.snapshot.paramMap.get('distributorObj');
    this.Summarydata = this.activatedroute.snapshot.paramMap.get('Summarydata');
    this.cartData = JSON.parse(this.cartData);
    this.Summarydata = JSON.parse(this.Summarydata);
    this.stockiestObj = JSON.parse(this.stockiestObj);
   

    console.log("cart data :",this.cartData);
    console.log("summary data :",this.Summarydata);
    this.stockiestObj.stockistCerpCode ? this.stockiestID = this.stockiestObj.stockistCerpCode : this.stockiestID = this.stockiestObj.stockiest;
    if (this.stockiestID == undefined) {
      let stobj = JSON.parse(this.stockiestObj);
      stobj.stockistCerpCode ? this.stockiestID = stobj.stockistCerpCode : this.stockiestID = null;

    }
    //if for reorder screen
    if (this.stockiestID == null) {
      this.stockiestObj ? this.stockiestID = this.stockiestObj : '';
    }
    this.orderDate = new Date();
    this.orderDate = this.datePipe.transform(this.orderDate, 'dd-MM-yyyy');
  }

  ngOnInit() {
  }
  searchbarChanged() {

  }
  goBack() {

  }
  saveOrder() {

    var data = {
      "Ord_Header_BO":
      {
        "hcpCode": this.storageService.getHcpCode(),
        "StockistCerpCode": this.stockiestID.toString(),
        "gskOrderDate": this.orderDate.toString(),
        "orderValue": this.netPrice.toString(),
        "totalTax": this.Summarydata.gstTotal.toString(),
        "totalDiscount": this.Summarydata.savingValue.toString(),
        "modeOfPayment": "cod",
        "payGatewayRefNo": "111",
        "payGatewayTrxnDt": "",
        "createdOn": this.orderDate.toString(),
        "createdBy": this.storageService.getHcpCode(),
        "orderStatusId": "Ordered",
        "SubTotal": this.Summarydata.productSubTotal.toString()
        // "DeliveryDate":
      },
      "Order_Info_BO": []
    }

    this.cartData.map((ele: any, index) => {
      data.Order_Info_BO.push({
        "OrderLineNo": (index + 1).toString(),
        "ProductCode": ele.productCode.toString(),
        "Quantity": ele.quantity.toString(),
        "RatePerUnit": ele.total.toString(),
        "ProductValue":(ele.stockiestRate > 0 ? ele.stockiestRate:ele.ptr).toString(),
        "GskDiscountAmount": ele.productDiscount.toString(),
        "GskDiscountPercent": ele.disPercent != undefined ? ele.disPercent.toString() : '',
        "DisId": ele.disId != undefined ? ele.disId.toString() : '',
        "TaxPercent": ele.disPercent != undefined ? ele.disPercent.toString() : '',
        "TaxValue": ele.productDiscount.toString(),
      })
    })
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.saveOrder, data).subscribe((response: any) => {
      this.commonService.hideLoader();
      if (response.code == "200") {
        this.storageService.cartDetails = new CartDetails();
        this.removeCartItem();
      } else {
        this.commonService.showToast(response.message);
      }
    }, (err) => {
      this.commonService.hideLoader();
      this.commonService.showToast(err.message);
    });

  }

  removeCartItem() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.removeCart).subscribe(
      (response) => {
        this.commonService.hideLoader();
        if (response.code === '200') {
          this.commonService.badgeCountValue = 0;
        } 
        this.route.navigate(['my-orders']);
      },
      (error) => {
       // this.storageService.cartDetails = new CartDetails();
        this.commonService.hideLoader();
        this.route.navigate(['my-orders']);
      }
    )
  }
}
