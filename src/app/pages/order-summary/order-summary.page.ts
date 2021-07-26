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
  gstDiscountList:any=[];
  cartWithPDistributor: any ;
  products: any = [];
  productsArr: any = [];
  badgeCount = this.commonService.badgeCountValue;
  constructor(private router: Router, private apiService: ApiService,
    private commonService: CommonService,
    private storageService: StorageService,
    private activatedroute: ActivatedRoute
  ) {
   
    this.activatedroute.params.subscribe((params) => {
      if (params["cartInfo"]) {
        this.cartWithPDistributor = JSON.parse(params["cartInfo"]);
        console.log("summary data :",this.cartWithPDistributor);
      } if (params["stockiest"]) {
        this.stockiestObj = JSON.parse(params["stockiest"]);
        console.log("summary data obj:",this.stockiestObj);

      } if (params["fromView"]) {
        this.formView = params["fromView"];
      } if (params["fromEvent"]) {
        this.formEvent = params["fromEvent"];
      }
    })

  }

  ionViewWillEnter(){
    if(this.storageService.cartDetails.isAddProduct){
      this.productsArr = [];
        this.products =  this.storageService.cartDetails.cart;
        this.storageService.cartDetails.isAddProduct = false;
        this.storageService.cartDetails.fromCart = false;
        this.products.forEach(element => {
       
          this.productsArr.push(element.productCode);
        });
        this.callAll();
    }
  }
  callAll() {
    this.getGSTDetail();
  }

  ngOnInit() {
    if ((this.formView == "product-list" && this.formEvent == "buyNow") || (this.formView == "product-list" && this.formEvent == "aCart")) {
      this.cartWithPDistributor.forEach(element => {
       
        if (element.stockiestOne) {
          if (this.stockiestObj.stockiest === element.stockiestOne.stockiest) {
            element.stockiestOne.stockiest ?
              element.unitCart.stockiestRate = element.stockiestOne.stokiestRate : 0;
          }
        } if (element.stockiestTwo) {
          if (this.stockiestObj.stockiest === element.stockiestTwo.stockiest) {

            element.stockiestTwo.stokiestRate ? element.unitCart.stockiestRate = element.stockiestTwo.stokiestRate : 0;
          }
        } if (element.stockiestThree) {
          if (this.stockiestObj.stockiest === element.stockiestThree.stockiest) {
            element.stockiestThree.stokiestRate ? element.unitCart.stockiestRate = element.stockiestThree.stokiestRate : 0;
          }
        }
        this.products.push(element.unitCart);
      });
     
      this.products.forEach(element => {
       
        this.productsArr.push(element.productCode);
      });
      this.callAll();
    }
    if ((this.formView == "distributor" && this.formEvent == "buyNow") || (this.formView == "distributor" && this.formEvent == "aCart")) {
      
      this.cartWithPDistributor.forEach(element => {
        this.products.push(element);
        this.productsArr.push(element.productCode);
        this.callAll();
      })
    }
  }

  addNewProduct() {
   
    this.storageService.cartDetails.isAddProduct = true;
    this.storageService.cartDetails.fromCart = false;
    this.storageService.cartDetails.cart = this.products;
    this.storageService.cartDetails.distributor = this.stockiestObj;
    this.router.navigate(['product-list']);
  }

  continue() {
   
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
        let unitPrice = ele.ptr / ele.quantity;
        if (event === 'add') {
          ele.quantity++;
          this.setGSTDiscount(this.gstDiscountList);
          this.calculateTotal(productCode, index);
          this.setDiscount();
        } else {
          if (ele.quantity > 1) {
            ele.quantity--;
            this.setGSTDiscount(this.gstDiscountList);
            this.calculateTotal(productCode, index);
            this.setDiscount();
          } else {
            this.deleteItem(productCode, index);
          }
        }
       
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
      total = ((element.stockiestRate > 0 ? element.stockiestRate : element.ptr) * element.quantity);
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
        this.productsArr.splice(index,1);
        this.gstDiscountList.splice(index,1);
        this.setGSTDiscount(this.gstDiscountList);
        this.calculateTotal();
        this.setDiscount();
        if (this.commonService.badgeCountValue > 0 && response.message === 'Cart Product Removed') {
          this.badgeCount = this.commonService.badgeCountValue = this.commonService.badgeCountValue - 1;
        }
        if (this.products?.length == 0) {
          this.router.navigate(['/product-list']);
        }
      },
      (error) => {
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }

  getGSTDetail() {
    this.apiService.getDataService(this.apiService.getGSTdetail, this.productsArr.toString()).subscribe((response: any) => {
    console.log("gst response",response);
      var total = 0;
      if (response.gstDetailList) {
        this.gstDiscountList = response.gstDetailList;
        this.setGSTDiscount(response.gstDetailList)
      }
    this.calculateTotal();
    this.getDiscountList();
    })
  }
setGSTDiscount(gstDetailList:any){
  var total = 0;
  this.gstTotal = 0;
  gstDetailList.forEach((element,index) => {
    total = parseInt(element.cgstRate) + parseInt(element.sgstRate);
    total = (((this.products[index].stockiestRate > 0 ? this.products[index].stockiestRate : this.products[index].ptr)*this.products[index].quantity)/100)*total;
    this.gstTotal += total;
  });
}
  getDiscountList() {
    this.discountInfo = this.storageService.getProductDiscount();
    this.setDiscount();
  }


  setDiscount(products?: any) {
   
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
       
        // this.discountInfo.gskDisPercentList.map(
        this.discountInfo.disPercentWithProdList.map(
          (innerEle: any) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPercentDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle;
              //add discount logic according to disPercent
              innerEle.gskDisPercentList.map((percentList,index) => {
                if (ele.quantity >= percentList.minQty && (innerEle.gskDisPercentList.length-1 == index || innerEle.gskDisPercentList[index+1]?.minQty > ele.quantity)) {
                 console.log("percentList.disPercent",percentList.disPercent);
                  this.subTotal = 0;
                  var total = 0;
                  total = ele.quantity * ele.ptr;
                  console.log("ele.ptr",ele.ptr);
                  this.subTotal = (total - ((total/100) * percentList.disPercent));
                  console.log("this.subTotal",this.subTotal)
                  this.savingValue = total - this.subTotal;
                 
                  ele.total = total;
                  ele.productDiscount = this.subTotal;
                  ele.savingValue = this.savingValue;
                  ele.disId = innerEle.disId;
                  ele.disPercent = innerEle.disPercent;
                  ele.disFlag = innerEle.disFlag;
                
                  //ele. = 
                } else {
                  total = ele.quantity * ele.ptr;
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
              ele.total = ele.quantity * ele.ptr;
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
                      total = ele.quantity * ele.ptr;
                      this.subTotalTwo = (ele.quantity * percentList.disAmtPerUnit);
                      this.savingValueTwo = this.subTotalTwo;
                      ele.total = total;
                      ele.productDiscount = this.subTotalTwo;
                      ele.savingValue = this.savingValueTwo;
                      ele.disId = percentList.disId;
                      ele.disPercent = percentList.disAmtPerUnit;
                      ele.disFlag = percentList.disFlag;
                    
                    } else {
                      total = ele.quantity * ele.ptr;
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
                  ele.total = ele.quantity * ele.ptr;
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

       
        this.savingValue = this.savingValueTwo + this.savingValue;
        discountItem.productCode = ele.productCode;
        this.dViaProduct.push(discountItem);
       
      }
    )
   
    this.netPrice = ((this.productSubTotal + this.gstTotal) - this.savingValue);
  }

}
