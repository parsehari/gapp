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
  productSubTotal: any = 0;
  gskDiscount: any;
  savingValue: any;
  discountObj: any;
  discountInfo: any;
  netPrice: any;
  dViaProduct: DiscountProduct[] = [];

  cartWithPDistributor: any;
  products: any = [];
  productsArr: any = [];
  constructor(private router: Router, private apiService: ApiService,
    private commonService: CommonService,
    private storageService: StorageService,
    private activatedroute: ActivatedRoute
  ) {
    this.cartWithPDistributor = this.activatedroute.snapshot.paramMap.get('cartInfo');
    this.cartWithPDistributor = JSON.parse(this.cartWithPDistributor);
    this.cartWithPDistributor.forEach(element => {
      this.products.push(element.unitCart);
    });
    console.log("products ", this.products);
    this.products.forEach(element => {
      console.log("elem ", element);
      this.productsArr.push(element.productCode);
    });
  }

  ngOnInit() {
    this.getGSTDetail();
    this.calculateTotal();
    this.getDiscountList();
  }

  addNewProduct() {
    this.router.navigate(['product-list']);
  }

  continue() {
    console.log("products ", this.products);
    console.log("netprice ", this.netPrice);
    this.router.navigate(['payment', { products: JSON.stringify(this.products), netPrice: this.netPrice }]);
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
      response.gstDetailList.forEach(element => {
        total = parseInt(element.cgstRate) + parseInt(element.sgstRate);
        this.gstTotal += total;
      });
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
    this.gskDiscount = 0;
    this.netPrice = 0;
    this.products.map(
      (ele) => {
        var discountItem = new DiscountProduct();
        discountItem.isPercentDiscount = false;
        discountItem.isDiscount = false;
        this.discountInfo.gskDisPercentList.map(
          (innerEle: any) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPercentDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle;
              //add discount logic according to disPercent
              let total = ele.quantity * ele.mrp;
              this.subTotal = (total - ((total * innerEle.disPercent) / 100));
              this.savingValue += total - this.subTotal;
              this.gskDiscount += this.subTotal;
              console.log("innerEle.disPercent ", innerEle.disPercent);
              console.log("gskDiscount ", this.gskDiscount);
              console.log("ele.productCode ", ele.productCode);
              ele.total = total;
              ele.productDiscount = this.subTotal;
              ele.savingValue = this.savingValue;
              ele.gskDiscount = this.gskDiscount;
            } else {
              ele.total = ele.quantity * ele.mrp;
              ele.productDiscount = this.subTotal;
              ele.savingValue = this.savingValue;
              ele.gskDiscount = this.gskDiscount;
              console.log("inside element ", ele);
            }
          }
        )
        if (discountItem.isPercentDiscount == false) {
          this.discountInfo.gskDisPerUnitPerProdList.map(
            (innerEle) => {
              if (innerEle != null) {
                if (ele.productCode === innerEle.gskProductCode) {
                  discountItem.isDiscount = true;
                  discountItem.uDiscount = innerEle.gskDisPerUnitList;
                  if (ele.quantity >= innerEle.minQty) {
                    let total = ele.quantity * ele.mrp;
                    this.subTotal = (total - ((total * innerEle.disPercent) / 100));
                    this.savingValue += total - this.subTotal;
                    this.gskDiscount += this.subTotal;
                    console.log("innerEle.disPercent ", innerEle.disPercent);
                    console.log("gskDiscount ", this.gskDiscount);
                    console.log("ele.productCode ", ele.productCode);
                    console.log("savingValue ", this.savingValue);
                    ele.total = total;
                    ele.productDiscount = this.subTotal;
                    ele.savingValue = this.savingValue;
                    ele.gskDiscount = this.gskDiscount;
                  }
                } else {
                  console.log("second inner ", ele);
                  ele.total = ele.quantity * ele.mrp;
                  ele.productDiscount = this.subTotal;
                  ele.savingValue = this.savingValue;
                  ele.gskDiscount = this.gskDiscount;
                  console.log("inside element ", ele);
                }
              }
            }
          )
        }
        discountItem.productCode = ele.productCode;
        this.dViaProduct.push(discountItem);
      }
    )
    console.log("gst Total ", this.gstTotal);
    this.netPrice = ((this.productSubTotal + this.gstTotal) - this.gskDiscount);
    //  console.log("netPrice ", this.netPrice);
  }

}
