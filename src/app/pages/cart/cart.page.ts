import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartModel } from 'src/app/Model/cart.model';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  quantity = 0;
  cartProducts: CartModel[] = [];
  fromView = 'product-list';
  fromEvent = 'aCart';
  badgeCountValue = 0;
  stockiest: PreferredDistributorModel;
  constructor(private route: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private aRoute: ActivatedRoute
  ) {
    this.aRoute.params.subscribe(
      (param) => {
        if (param['fromEvent']) {
          this.fromEvent = param['fromEvent'];
        }
        if (param['fromView']) {
          this.fromView = param['fromView'];
        }
        if (param['stockiest']) {
          this.stockiest = param['stockiest'];
        }
      }
    )
  }

  ngOnInit() {
    this.getCartItem();
  }

  getCartItem() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.getCartAPI).subscribe((resp: any) => {
      console.log("response cart ", resp);
      if (resp.getProdList) {
        this.cartProducts = resp.getProdList;
        this.commonService.hideLoader();
        this.commonService.badgeCountValue = this.cartProducts.length;
        this.badgeCountValue = this.commonService.badgeCountValue;
      } else {
        this.commonService.hideLoader();
      }
    }, (err) => {
      console.log("error in cart", err);
      this.commonService.hideLoader()
      this.commonService.showToast(err);
    });
  }

  goBack() {

  }
  changeQty() {

  }
  continueClicked() {
    let cartItem = this.cartProducts.filter(
      (ele) => {
        if (ele.quantity > 0) {
          return true;
        }
        return false;
      }
    )
    if (cartItem.length == 0) {
      this.commonService.presentOneButtonAlert('GSK', 'Please add item to cart before proceed', 'OK')
    } else {
      let cartList: CartModel[] = [];
      cartItem.map(
        (ele) => {
          var cartProd = new CartModel();
          cartProd.productCode = ele.productCode;
          cartProd.productDescription = ele.productDescription;
          cartProd.productImage = '';
          cartProd.quantity = ele.quantity;
          cartProd.mrp = ele.mrp;
          cartList.push(cartProd);
        }
      )
      var cartJson = {
        "Gsk_CartList": cartList
      }
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL, cartJson).subscribe(
        (response) => {
          this.commonService.hideLoader();
          if (this.fromView === 'distributor') {
            this.route.navigate(['/order-summary', { stockiest: JSON.stringify(this.stockiest), cartInfo: JSON.stringify(cartItem), fromView: this.fromView, fromEvent: this.fromEvent }]);
          } else {
            this.route.navigate(['/select-distributor', { param: JSON.stringify(cartItem) }])
          }
        },
        (error) => {
          this.commonService.toast(error);
        }
      )
    }
  }
  addNewProduct() {
    this.route.navigate(['/product-list'])
  }
  modifyQuantity(event, productCode, index) {
    this.cartProducts.map((ele) => {
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
      }
    });
  }

  getImageURL(productImage): any {
    return this.commonService.getImageURLFromBase64(productImage);
  }
  deleteItem(pCode, index) {
    var removeItem = {
      productcode: pCode
    }
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.removeItemURL, removeItem).subscribe(
      (response) => {
        this.commonService.hideLoader()
        this.cartProducts.splice(index, 1);
        this.commonService.badgeCountValue = this.commonService.badgeCountValue - 1;
        this.badgeCountValue = this.badgeCountValue - 1;
        console.log("remove cart response:", response);
      },
      (error) => {
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }
}
