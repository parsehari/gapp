import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CartModel } from 'src/app/Model/cart.model';
import { DiscountProduct } from 'src/app/Model/discount-product.model';
import { Discount } from 'src/app/Model/discount.model';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  productList:Product[];
  quantity=0;
  discountInfo : Discount;
  dViaProduct: DiscountProduct[] = [];
  constructor(private menu : MenuController,private route :Router,
    private apiService:ApiService,
    private commonService:CommonService,
    ) { }

  ngOnInit() {
    this.menu.enable(true);
    this.commonService.showLoader()
    this.apiService.setDistributorHeader();
    this.apiService.getDataService(this.apiService.getProductURL).subscribe(
      (response)=>{
        console.log("response :",response);
        this.productList = response.gskProdList;
        this.productList.map((ele)=>{
          ele.quantity = 0;          
        })
        setTimeout(() => {
          this.getDiscount();
        }, 200);
      },
      (error)=>{
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }
 getDiscount(){
   this.apiService.getDataService(this.apiService.getDiscount).subscribe(
     (response)=>{
       console.log("get Discount data :",JSON.stringify(response));
       this.discountInfo = response;
       console.log("get Discount data from list:",JSON.stringify(this.discountInfo));
       this.commonService.hideLoader();
       this.setDiscountData();
     },
     (error)=>{
       this.commonService.hideLoader();
       this.commonService.showToast(error);
     }
   )
 }

 setDiscountData(){
   this.productList.map(
     (ele)=>{
       var discountItem = new DiscountProduct();
       discountItem.isPercentDiscount=false;
       discountItem.isDiscount=false;
       this.discountInfo.gskDisPercentList.map(
         (innerEle)=>{
           if(ele.productCode === innerEle.gskProductCode){
             discountItem.isPercentDiscount = true;
             discountItem.isDiscount = true;
             discountItem.pDiscount = innerEle;
           }
         }
       )
       if(discountItem.isPercentDiscount == false){
        this.discountInfo.gskDisPerUnitPerProdList.map(
          (innerEle)=>{
           if(innerEle != null){
            if(ele.productCode === innerEle.gskProductCode){
              discountItem.isDiscount = true;
              discountItem.uDiscount = innerEle.gskDisPerUnitList;
            }
           }
          }
        )
       }
       discountItem.productCode = ele.productCode;
       this.dViaProduct.push(discountItem);
     }
   )
 }
  searchInputValueChange(event){
  console.log("change",event);
  }
  addToCart(){
    var cartData = this.productList.filter((ele)=>{
      if(ele.quantity > 0){
        return true;
      }else{
        return false;
      }
    })
    if(cartData.length == 0){
      this.commonService.presentOneButtonAlert('GSK','Please select product.','OK');
    }else{

      let cartList:CartModel[] = [];
      cartData.map(
        (ele)=>{
          var cartProd = new CartModel();
          cartProd.productCode = ele.productCode;
          cartProd.productDescription = ele.productDescription;
          cartProd.productImage = ele.productImage;
          cartProd.quantity = ele.quantity;
          cartProd.mrp = parseFloat(ele.ptr);
          cartList.push(cartProd);
        }
      )
      var cartJson = {
        "Gsk_CartList":cartList
      }
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL,cartJson).subscribe(
        (response)=>{
          console.log("save cart data :", response);
          this.commonService.hideLoader();
          this.route.navigate(['/cart']);
        },
        (error)=>{
          this.commonService.showToast(error);
          this.commonService.hideLoader()
          console.log("error :",error);
        }
      )
    }
  }
  buyNow(){
    this.route.navigate(['/select-distributor']);
  }

  modifyQuantity(event,productCode){
   this.productList.map((ele)=>{
     if(ele.productCode === productCode){
      if(event === 'add'){
        ele.quantity ++ ;
      }else{
        if(ele.quantity != 0) 
         ele.quantity -- ;
        }
      }
    })
  }
  
  getImageURL(imageSource){
    return this.commonService.getImageURLFromBase64(imageSource);
  }
  
}
