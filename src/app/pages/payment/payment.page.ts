import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  public cartData: any;
  public netPrice: any;
  constructor(private activatedroute: ActivatedRoute, private commonService: CommonService,
    private storageService: StorageService, private apiService: ApiService, private route: Router) {
    this.cartData = this.activatedroute.snapshot.paramMap.get('products');
    this.netPrice = this.activatedroute.snapshot.paramMap.get('netPrice');
    this.cartData = JSON.parse(this.cartData);
    console.log("cartData ", this.cartData);
    console.log("netPrice ", this.netPrice);
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
        "StockistCerpCode": "1100045678",
        "gskOrderDate": "21-06-2021",
        "orderValue": this.netPrice,
        "totalTax": "11",
        "totalDiscount": "11",
        "modeOfPayment": "cod",
        "payGatewayRefNo": "111",
        "payGatewayTrxnDt": "",
        "createdOn": "",
        "createdBy": this.storageService.getHcpCode(),
        "orderStatusId": "Ordered"
      },
      "Order_Info_BO": []
    }

    this.cartData.map((ele: any, index) => {
      console.log('element ', ele);
      data.Order_Info_BO.push({
        "OrderLineNo": "22",
        "ProductCode": ele.productCode.toString(),
        "Quantity": ele.quantity.toString(),
        "RatePerUnit": ele.total.toString(),
        "ProductValue": ele.mrp.toString(),
        "GskDiscountAmount": "10",
        "GskDiscountPercent": "20",
        "DisId": "Dis1",
        "TaxPercent": "30",
        "TaxValue": "40"
      })
    })
    console.log("data ", data);
    this.apiService.postDataService(this.apiService.saveOrder, data).subscribe((response: any) => {
      console.log("response ", response);
      if (response.code == "200") {
        this.commonService.showToast(response.message);
        this.route.navigate(['my-orders']);
      } else {
        this.commonService.showToast(response.message);
      }
    }, (err) => {
      console.log("error ", err);
      this.commonService.showToast(err.message);
    });

  }
}
