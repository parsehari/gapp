import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartModel } from 'src/app/Model/cart.model';
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
  constructor(private route: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getCartItem();
  }

  getCartItem() {
    this.apiService.getDataService(this.apiService.getCartAPI).subscribe((resp: any) => {
      console.log("response cart ", resp);
      if (resp.getProdList)
        this.cartProducts = resp.getProdList;
      else
        this.commonService.showToast(resp.message);
    }, (err) => {
      console.log("error in cart", err);
    });
  }

  goBack() {

  }
  changeQty() {

  }
  continueClicked() {
    let cartItem = this.cartProducts.filter(
      (ele)=>{
        if(ele.quantity >0){
          return true;
        }
        return false;
      }
    )
    if(cartItem.length == 0){
     this.commonService.presentOneButtonAlert('GSK','Please add item to cart before proceed','OK')
    }else{
      var cartJson = {
        "Gsk_CartList":cartItem
      }
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL,cartJson).subscribe(
        (response)=>{
          this.commonService.hideLoader();
          this.route.navigate(['/select-distributor',{param:JSON.stringify(cartItem)}])
        },
        (error)=>{
           this.commonService.toast(error);
        }
      )
    }
  }
  addNewProduct() {
    this.route.navigate(['/product-list'])
  }
  modifyQuantity(event,productCode,index) {
    this.cartProducts.map((ele)=>{
      if(ele.productCode === productCode){
       let unitPrice = ele.mrp/ele.quantity;
        if (event === 'add') {
          ele.quantity ++;
        } else {
          if(ele.quantity > 1){
            ele.quantity --;
          }else{
               this.deleteItem(productCode,index);
          }
        }
      }
    });
  }

  getImageURL(productImage):any{
   return this.commonService.getImageURLFromBase64(productImage);
  }
  deleteItem(pCode,index){
    var removeItem = {
      productcode:pCode
    }
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.removeItemURL,removeItem).subscribe(
      (response)=>{
        this.commonService.hideLoader()
        this.cartProducts.splice(index,1);
         console.log("remove cart response:", response);
      },
      (error)=>{
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }
}
