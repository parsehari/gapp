import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { DiscountProduct } from 'src/app/Model/discount-product.model';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {
  quantity = 0;
  gstTotal: any = 0;
  subTotal: any = 0;
  subTotalTwo: any = 0;
  productSubTotal: any = 0;
  gskDiscount: any;
  savingValue: any;
  savingValueTwo: any;
  discountObj: any;
  discountInfo: any;
  netPrice: any;
  dViaProduct: DiscountProduct[] = [];
  stockiestObj: any;
  formView: any;
  formEvent: any;

  cartWithPDistributor: any;
  products: any = [];
  productsArr: any = [];
  constructor(private router: Router, private apiService: ApiService,
    private commonService: CommonService,
    private storageService: StorageService,
    private activatedroute: ActivatedRoute
  ) {
    console.log("this previous ", this.commonService.getPreviousUrl());
    this.activatedroute.params.subscribe((params) => {
      if (params["cartInfo"]) {
        this.cartWithPDistributor = JSON.parse(params["cartInfo"]);
      } if (params["stockiest"]) {
        this.stockiestObj = JSON.parse(params["stockiest"]);
      } if (params["fromView"]) {
        this.formView = params["fromView"];
      } if (params["fromEvent"]) {
        this.formEvent = params["fromEvent"];
      }

      console.log('this.stockiestObj ', this.stockiestObj);

      if ((this.formView == "product-list" && this.formEvent == "buyNow") || (this.formView == "product-list" && this.formEvent == "aCart")) {
        this.cartWithPDistributor.forEach(element => {
          console.log("element ", element);
          if (element.stockiestOne) {
            if (this.stockiestObj.stockiest === element.stockiestOne.stockiest) {
              element.stockiestOne.stockiest ?
                element.unitCart.mrp = element.stockiestOne.stokiestRate : '';

            }
          } if (element.stockiestTwo) {
            if (this.stockiestObj.stockiest === element.stockiestTwo.stockiest) {

              element.stockiestTwo.stokiestRate ? element.unitCart.mrp = element.stockiestTwo.stokiestRate : '';
            }
          } if (element.stockiestThree) {
            if (this.stockiestObj.stockiest === element.stockiestThree.stockiest) {
              element.stockiestThree.stokiestRate ?
                element.unitCart.mrp = element.stockiestThree.stokiestRate : '';
            }
          }
          this.products.push(element.unitCart);
        });
        console.log("products ", this.products);
        this.products.forEach(element => {
          console.log("elem ", element);
          this.productsArr.push(element.productCode);
        });
        this.callAll();
      }
      if ((this.formView == "distributor" && this.formEvent == "buyNow") || (this.formView == "distributor" && this.formEvent == "aCart")) {
        console.log("buyNow aCart");
        this.cartWithPDistributor.forEach(element => {
          this.products.push(element);
          this.productsArr.push(element.productCode);
          this.callAll();
        })
      }
    })

  }

  callAll() {
    this.getGSTDetail();
    this.calculateTotal();
    this.getDiscountList();
  }

  ngOnInit() {

  }

  addNewProduct() {
    this.router.navigate(['product-list']);
  }

  continue() {
    console.log("products ", this.products);
    console.log("netprice ", this.netPrice);
    var data = {
      gstTotal: this.gstTotal,
      subTotal: this.subTotal,
      productSubTotal: this.productSubTotal,
      gskDiscount: this.gskDiscount,
      savingValue: this.savingValue
    }
    this.router.navigate(['payment', { products: JSON.stringify(this.products), netPrice: this.netPrice, distributorObj: JSON.stringify(this.stockiestObj), Summarydata: JSON.stringify(data) }]);
  }
  modifyQuantity(event: any, productCode: any, index: any) {
    this.products.map((ele) => {
      if (ele.productCode === productCode) {
        let unitPrice = ele.mrp / ele.quantity;
        if (event === 'add') {
          ele.quantity++;
        } else {
          if (ele.quantity > 1) {
            ele.quantity--;
          } else {
            this.deleteItem(productCode, index);
          }
        }
        this.calculateTotal(productCode, index);
        this.setDiscount();
      }
    });
  }
  removeAll() {
    if (this.formEvent === 'buyNow') {
      this.commonService.badgeCountValue = 0;
      this.router.navigate(['/product-list']);
      this.commonService.presentOneButtonAlert('GSK', "Cart item removed.", "OK")
    } else {
      this.commonService.showLoader();
      this.apiService.getDataService(this.apiService.removeCart).subscribe(
        (response) => {
          this.commonService.hideLoader();
          if (response.code === '200') {
            this.commonService.badgeCountValue = 0;
            this.router.navigate(['/product-list']);
            this.commonService.presentOneButtonAlert('GSK', "Cart item removed.", "OK")
          } else {
            this.commonService.showToast(response.message);
          }
        },
        (error) => {
          this.commonService.hideLoader();
          this.commonService.showToast(error.message);
        }
      )
    }
  }
  calculateTotal(prd?: any, i?: any) {
    var total = 0;
    this.productSubTotal = 0;
    this.products.forEach(element => {
      total = (element.mrp * element.quantity);
      this.productSubTotal += total;
    });
  }

  deleteItem(pCode: any, index: any) {
    var removeItem = {
      productcode: pCode
    }
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.removeItemURL, removeItem).subscribe(
      (response) => {
        this.commonService.hideLoader()
        this.products.splice(index, 1);
        console.log("remove cart response:", response);
        this.calculateTotal();
        this.setDiscount();
      },
      (error) => {
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }

  getGSTDetail() {
    this.apiService.getDataService(this.apiService.getGSTdetail, this.productsArr.toString()).subscribe((response: any) => {
      console.log("response ", response);
      var total = 0;
      if (response.gstDetailList) {
        response.gstDetailList.forEach(element => {
          total = parseInt(element.cgstRate) + parseInt(element.sgstRate);
          this.gstTotal += total;
        });
      }
      this.setDiscount();
    })
  }

  getDiscountList() {
    this.discountInfo = this.storageService.getProductDiscount();
    console.log("dViaProduct ", this.discountInfo);
    this.setDiscount();
  }


  setDiscount(products?: any) {
    console.log("products ", products);
    this.subTotal = 0;
    this.savingValue = 0;
    this.savingValueTwo = 0;
    this.gskDiscount = 0;
    this.netPrice = 0;
    this.products.map(
      (ele: any) => {
        var discountItem = new DiscountProduct();
        discountItem.isPercentDiscount = false;
        discountItem.isDiscount = false;
        console.log("this.discountInfo  ", this.discountInfo);
        // this.discountInfo.gskDisPercentList.map(
        this.discountInfo.disPercentWithProdList.map(
          (innerEle: any) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPercentDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle;
              //add discount logic according to disPercent
              innerEle.gskDisPercentList.map((percentList: any) => {
                if (ele.quantity >= percentList.minQty) {
                  this.subTotal = 0;
                  var total = 0;
                  total = ele.quantity * ele.mrp;
                  this.subTotal = (total - ((total * percentList.disPercent) / 100));
                  this.savingValue = total - this.subTotal;
                  console.log("subTotalone ", this.subTotal);
                  ele.total = total;
                  ele.productDiscount = this.subTotal;
                  ele.savingValue = this.savingValue;
                  ele.disId = innerEle.disId;
                  ele.disPercent = innerEle.disPercent;
                  ele.disFlag = innerEle.disFlag;
                  console.log("test ", ele.productCode);
                  //ele. = 
                } else {
                  total = ele.quantity * ele.mrp;
                  this.subTotal = total;
                  this.savingValue += total - this.subTotal;
                  ele.total = total;
                  ele.productDiscount = this.subTotal;
                  ele.savingValue = this.savingValue;
                  ele.disId = percentList.disId;
                  ele.disPercent = percentList.disPercent;
                  ele.disFlag = percentList.disFlag;
                }
              })
            } else {
              ele.total = ele.quantity * ele.mrp;
              ele.productDiscount = this.subTotal;
              ele.savingValue = this.savingValue;
              //  ele.gskDiscount = this.gskDiscount;
              ele.disId = innerEle.disId ? innerEle.disId : "";
              ele.disPercent = innerEle.disPercent ? innerEle.disPercent : "";
              ele.disFlag = innerEle.disFlag ? innerEle.disFlag : "";
            }
          }
        )
        if (discountItem.isPercentDiscount == false) {
          this.discountInfo.gskDisPerUnitPerProd.map(
            //  this.discountInfo.gskDisPerUnitPerProdList.map(
            (innerEle: any) => {
              if (innerEle != null) {
                if (ele.productCode === innerEle.gskProductCode) {
                  discountItem.isDiscount = true;
                  discountItem.uDiscount = innerEle.gskDisPerUnitList;
                  innerEle.gskDisPerUnitList.map((percentList: any) => {
                    if (ele.quantity >= percentList.minQty) {
                      this.subTotalTwo = 0;
                      var total = 0;
                      total = ele.quantity * ele.mrp;
                      this.subTotalTwo = (ele.quantity * percentList.disAmtPerUnit);
                      this.savingValueTwo = this.subTotalTwo;
                      ele.total = total;
                      ele.productDiscount = this.subTotalTwo;
                      ele.savingValue = this.savingValueTwo;
                      ele.disId = percentList.disId;
                      ele.disPercent = percentList.disAmtPerUnit;
                      ele.disFlag = percentList.disFlag;
                      console.log("test2 ", ele.productCode);
                    } else {
                      total = ele.quantity * ele.mrp;
                      this.subTotalTwo = total;
                      this.savingValue += total - this.subTotalTwo;
                      // this.gskDiscount += this.subTotal;
                      ele.total = total;
                      ele.productDiscount = this.subTotalTwo;
                      ele.savingValue = this.savingValueTwo;
                      //  ele.gskDiscount = this.gskDiscount;
                      ele.disId = percentList.disId;
                      ele.disPercent = percentList.disAmtPerUnit;
                      ele.disFlag = percentList.disFlag;
                    }
                  })
                } else {
                  ele.total = ele.quantity * ele.mrp;
                  ele.productDiscount = this.subTotalTwo;
                  ele.savingValue = this.savingValue;
                  ele.gskDiscount = this.gskDiscount;
                  ele.disId = innerEle.disId ? innerEle.disId : "";
                  ele.disPercent = innerEle.disAmtPerUnit ? ele.disPercent = innerEle.disAmtPerUnit : 0;
                  ele.disFlag = innerEle.disFlag ? innerEle.disFlag : "";
                }
              }
            }
          )
        }

        console.log("subTotalTwo ", this.subTotalTwo);
        this.savingValue = this.savingValueTwo + this.savingValue;
        discountItem.productCode = ele.productCode;
        this.dViaProduct.push(discountItem);
        console.log("saving value ", this.savingValue);
      }
    )
    console.log("gst Total ", this.gstTotal);
    this.netPrice = ((this.productSubTotal + this.gstTotal) - this.savingValue);
    //  console.log("netPrice ", this.netPrice);
  }

}
