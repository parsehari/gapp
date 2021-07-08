import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CartModel } from 'src/app/Model/cart.model';
import { DiscountProduct } from 'src/app/Model/discount-product.model';
import { Discount } from 'src/app/Model/discount.model';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { ProductByDistributor } from 'src/app/Model/product-distributor.model';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  productList: Product[] = [];
  distributor: PreferredDistributorModel;
  dProductList: ProductByDistributor[];
  quantity = 0;
  discountInfo: Discount;
  fromView: string;
  dViaProduct: DiscountProduct[] = [];
  constructor(private menu : MenuController,private router :Router,
    private apiService:ApiService,
    private commonService:CommonService,
    private route:ActivatedRoute
    ) {
      this.route.params.subscribe(
        (param)=>{
         if(param){
           if(param['distributor']){
            this.distributor = JSON.parse(param['distributor']);
            this.fromView = param['fromView'];
           }
         }
        }
        )
      }
  

  ngOnInit() {
    this.menu.enable(true);
    this.commonService.showLoader()
    this.apiService.setDistributorHeader();
    if(this.fromView === 'distributor'){
       this.apiService.postDataService(this.apiService.getDistributorProduct,{StockistCerpCode:this.distributor.stockistCerpCode}).subscribe(
         (response)=>{
           this.commonService.hideLoader();
           console.log("product distributor :",response)
           this.dProductList = response.distributorList;
           this.commonService.hideLoader();
           this.setProductData();
           this.getDiscount();
         },
         (error)=>{
          this.commonService.hideLoader();
          this.commonService.showToast(error);
        }
      )
    } else {
      this.apiService.getDataService(this.apiService.getProductURL).subscribe(
        (response)=>{
          console.log("response :",response);
          this.commonService.hideLoader()
          this.productList = response.gskProdList;
          this.productList.map((ele) => {
            ele.quantity = 0;
          })
            this.getDiscount();
        },
        (error) => {
          this.commonService.hideLoader()
          this.commonService.showToast(error)
        }
      )
    }
  }

  setProductData() {
    this.dProductList.map(
      (ele) => {
        var prod = new Product();
        prod.productCode = ele.prodCode;
        prod.productDescription = ele.productDescription;
        prod.productImage = ele.productImage;
        prod.quantity = 0;
        prod.stockistCerpCode = ele.stockistCerpCode;
        prod.stokiestRate = ele.stokiestRate;
        if(ele.stokiestRate > 0){
          prod.ptr = ele.stokiestRate.toString();
        } else {
          prod.ptr = ele.ptr.toString();
        }
        this.productList.push(prod);
      }
    )
  }
 getDiscount(){
   this.commonService.showLoader();
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

  setDiscountData() {
    this.productList.map(
      (ele) => {
        var discountItem = new DiscountProduct();
        discountItem.isPercentDiscount = false;
        discountItem.isDiscount = false;
        this.discountInfo.gskDisPercentList.map(
          (innerEle) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPercentDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle;
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
  searchInputValueChange(event) {
    console.log("change", event);
  }
  addToCart() {
    var cartData = this.productList.filter((ele) => {
      if (ele.quantity > 0) {
        return true;
      } else {
        return false;
      }
    })
    if (cartData.length == 0) {
      this.commonService.presentOneButtonAlert('GSK', 'Please select product.', 'OK');
    } else {

      let cartList: CartModel[] = [];
      cartData.map(
        (ele) => {
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
        "Gsk_CartList": cartList
      }
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL, cartJson).subscribe(
        (response) => {
          console.log("save cart data :", response);
          this.commonService.hideLoader();
          this.router.navigate(['/cart']);
        },
        (error) => {
          this.commonService.showToast(error);
          this.commonService.hideLoader()
          console.log("error :", error);
        }
      )
    }
  }
  buyNow(){
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
      this.fromView = 'buyNow'
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
      );
      this.router.navigate(['/select-distributor',{param:JSON.stringify(cartList),fromView:this.fromView}])
    }
  }

  modifyQuantity(event, productCode) {
    this.productList.map((ele) => {
      if (ele.productCode === productCode) {
        if (event === 'add') {
          ele.quantity++;
        } else {
          if (ele.quantity != 0)
            ele.quantity--;
        }
      }
    })
  }

  getImageURL(imageSource) {
    return this.commonService.getImageURLFromBase64(imageSource);
  }

}
