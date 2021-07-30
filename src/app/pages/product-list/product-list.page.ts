import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { PdfViewerComponent } from 'src/app/components/pdf-viewer/pdf-viewer.component';
import { CartModel } from 'src/app/Model/cart.model';
import { DiscountProduct } from 'src/app/Model/discount-product.model';
import { Discount } from 'src/app/Model/discount.model';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { ProductByDistributor } from 'src/app/Model/product-distributor.model';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Events } from 'src/app/services/events';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  searchStr = "";
  productList: Product[] = [];
  distributor: any;
  quantity = 0;
  discountInfo: Discount;
  fromView: string = 'product-list';
  fromEvent: string = 'aCart';
  dViaProduct: DiscountProduct[] = [];
  badgeValue =  this.commonService.badgeCountValue;
  showCart = true;
  btnTitle="Done";
  cartJson:any = {}; 
  constructor(private menu: MenuController, private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private mCtrl:ModalController,
    private loc:Location,
    private appBrowser:InAppBrowser,
    private event:Events
  ) {
    this.route.params.subscribe(
      (param) => {
        if (param) {
          if (param['distributor']) {
            this.distributor = JSON.parse(param['distributor']);
            this.fromView = param['fromView'];
          }
        }
      }
    )
  }


  ngOnInit() {
    
 
    this.menu.enable(true);
    this.apiService.setDistributorHeader();
   
  }
  ionViewWillEnter(){
    
    this.badgeValue =  this.commonService.badgeCountValue;
    console.log("this.badgeValue ",this.badgeValue);
    this.showCart = !this.storageService.cartDetails.isAddProduct;
    
    if(this.storageService.cartDetails.isAddProduct && this.storageService.cartDetails.distributor){
     var dCode ='';
     if(this.storageService?.cartDetails?.distributor?.stockistCerpCode){
         dCode = this.storageService?.cartDetails?.distributor?.stockistCerpCode;
         
     }else{
        dCode = this.storageService.cartDetails.distributor.stockiest;
     }
     this.cartJson['StockistCerpCode']=dCode;
     this.cartJson['Preference']= this.storageService.cartDetails?.distributor?.preference ? this.storageService.cartDetails?.distributor?.preference : "";
      this.getProductByDistributor(dCode);
    }
  else if (this.fromView === 'distributor') {
    this.cartJson['StockistCerpCode']=this.distributor.stockistCerpCode;
     this.cartJson['Preference']= this.distributor?.preference ? this.distributor?.preference : "";
      this.getProductByDistributor(this.distributor.stockistCerpCode);
    } else {
      this.cartJson['StockistCerpCode']="";
      this.cartJson['Preference']= "";
      this.commonService.showLoader();
      this.apiService.getDataService(this.apiService.getProductURL).subscribe(
        (response) => {
          this.commonService.hideLoader();
          console.log("product -list",response);
          this.productList = response.gskProdList;
          this.storageService.setProductData(this.productList);
          this.getDiscount();
        },
        (error) => {
          this.commonService.hideLoader()
          this.commonService.showToast(error)
        }
      )
    }
  }

  getProductByDistributor(pCode){
    this.commonService.showLoader()
    this.apiService.postDataService(this.apiService.getDistributorProduct, { StockistCerpCode: pCode }).subscribe(
      (response) => {
        this.commonService.hideLoader();
        console.log("response list :",response);
        this.productList = response.distributorList;
        this.storageService.setProductData(this.productList);
        this.getDiscount();
      },
      (error) => {
        this.commonService.hideLoader();
        this.commonService.showToast(error);
      }
    )
  }
  ionViewDidEnter(){
    
  }
  getDiscountTotal(unit,discount){
    return  parseFloat(unit)* parseFloat(discount);
  }
  
  getDiscount() {
    this.commonService.showLoader()
    this.apiService.getDataService(this.apiService.getDiscount).subscribe(
      (response) => {
        this.commonService.hideLoader()
        
        this.discountInfo = response;
        console.log("response prod:", this.discountInfo)
        this.dViaProduct = [];
        this.storageService.setProductDiscount(this.discountInfo);
        this.setDiscountData();
      },
      (error) => {
        this.commonService.hideLoader();
        this.commonService.showToast(error);
      }
    )
  }
  onSearch(str){
   this.searchStr = str;
  }
  setDiscountData() {
    this.productList.map(
      (ele) => {
        ele.quantity =0;
        var discountItem = new DiscountProduct();
        discountItem.isPDiscount = false;
        discountItem.isDiscount = false;
        this.discountInfo.disPercentWithProdList.map(
          (innerEle) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle.gskDisPercentList;
            }
          }
        )
        if (discountItem.isPDiscount == false) {
          this.discountInfo.gskDisPerUnitPerProd.map(
            (innerEle) => {
              if (innerEle != null) {
                if (ele.productCode === innerEle.gskProductCode) {
                  discountItem.isDiscount = true;
                  discountItem.isUDiscount = true;
                  discountItem.uDiscount = innerEle.gskDisPerUnitList;
                }
              }
            }
          )
        }
        /*if(discountItem.isPDiscount == false && discountItem.isUDiscount == false){
          var total = 0;
          
          this.discountInfo.disGrpWithDisIdList.map(
            (innerEle) => {
              if (innerEle != null) {
                if (ele.productCode === innerEle.disId) {
                  discountItem.isDiscount = true;
                  discountItem.isGDiscount = true;
                 // discountItem.uDiscount = innerEle.gskDisPerUnitList;

                 innerEle.gskGrpDisDtlList.map((gEle)=>{
                   this.productList.filter((fEle)=>{
                     if(fEle.isProduct){
                       return true;
                     }
                   }).map((mEle,index)=>{
                     if(index == 0){
                      var minQty = mEle.salebleQty;
                     }
                      if(mEle.productCode === gEle.gskProductCode){
                        gEle.productDesc = mEle.productDescription;
                        if(mEle.stokiestRate > 0){
                          total +=mEle.stokiestRate 
                        }else{
                          total = 0;
                        }
                        if(minQty < mEle.salebleQty){
                          minQty = mEle.salebleQty;
                        }
                      }
                   })
                 })
                }
              }
            }
          )
          ele.stokiestRate = total;
        }*/
        discountItem.productCode = ele.productCode;
        this.dViaProduct.push(discountItem);
      }
    )
  }
  searchInputValueChange(event) {
  }

  getArrayList(cartData:Product[]):Array<CartModel>{
    let cartList: CartModel[] = [];
      cartData.map(
        (ele) => { 
          var cartProd = new CartModel();
          cartProd.productCode = ele.productCode;
          cartProd.productDescription = ele.productDescription;
          cartProd.productImage = '';
          cartProd.quantity = ele.quantity;
          cartProd.ptr = parseInt (ele.ptr);
          if(ele.stokiestRate){
            cartProd.stockiestRate = ele.stokiestRate;
          }else{
            cartProd.stockiestRate = 0;
          }
          if(this.storageService.cartDetails.isAddProduct){
            this.storageService.cartDetails.cart =  this.storageService.cartDetails.cart.filter(
               (innerele)=>{
                 if(innerele.productCode == ele.productCode){
                  cartProd.quantity  += innerele.quantity; 
                  return false;
                 }else{
                  innerele.productImage =""
                   return true;
                 }
               } 
              )
          }
          cartList.push(cartProd);
        }
      )
      if(this.storageService.cartDetails.isAddProduct){
      cartList = cartList.concat(this.storageService.cartDetails.cart);
      }
      return cartList;
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

      let cartList = this.getArrayList(cartData);
     
      this.cartJson['Gsk_CartList']=cartList;
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL, this.cartJson).subscribe(
        (response) => {
          this.commonService.hideLoader();
          if (this.fromView == 'distributor') {
            this.router.navigate(['/cart', { stockiest: JSON.stringify(this.distributor), fromView: this.fromView, fromEvent: this.fromEvent }]);
          } else {
            this.router.navigate(['/cart', { fromView: this.fromView, fromEvent: this.fromEvent }]);
          }
          this.productList = [];
        },
        (error) => {
          this.commonService.showToast(error);
          this.commonService.hideLoader()
        }
      )
    }
  }
  buyNow() {
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
          cartProd.ptr = parseInt(ele.ptr);
          if(ele.stokiestRate){
            cartProd.stockiestRate = ele.stokiestRate;
          }else{
            cartProd.stockiestRate = 0;

          }
          cartList.push(cartProd);
        }
      );
      if (this.fromView === 'distributor') {
        this.fromEvent = 'buyNow'
        this.router.navigate(['/order-summary', { stockiest: JSON.stringify(this.distributor), cartInfo: JSON.stringify(cartList), fromView: this.fromView, fromEvent: this.fromEvent }]);
      } else {
        this.fromEvent = 'buyNow'
        this.router.navigate(['/select-distributor', { param: JSON.stringify(cartList), fromView: this.fromView, fromEvent: this.fromEvent }]);
      }
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
 async viewPdf(prod :Product){
  const pdfModel = await this.mCtrl.create({
    component:PdfViewerComponent,
    cssClass:'pdf-style',
    componentProps: {
      'url': prod.pI_URL,
    }
  });
  return await pdfModel.present();
  }

  doneButtonClicked(){
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

      let cartList = this.getArrayList(cartData);
     
      if(this.storageService.cartDetails.fromCart){
        this.cartJson['Gsk_CartList']=cartList;

        this.commonService.showLoader();
        this.apiService.postDataService(this.apiService.saveCartURL, this.cartJson).subscribe(
          (response) => {
            this.commonService.hideLoader();
          this.router.navigate(['/cart', { stockiest: JSON.stringify(this.distributor), fromView: this.fromView, fromEvent: this.fromEvent }]);
          this.storageService.cartDetails.fromEvent = this.fromEvent;
          this.storageService.cartDetails.fromView = this.fromView;
          this.storageService.cartDetails.isAddProduct = false;
          this.storageService.cartDetails.fromCart = false;
          this.productList = [];
          },
          (error) => {
            this.commonService.showToast(error);
            this.commonService.hideLoader()
          }
        )
      }else{
        this.storageService.cartDetails.cart = cartList;
        this.loc.back();
      }
    }
  }
}
