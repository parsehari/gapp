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
  fromView: string = 'product-list';
  fromEvent: string = 'aCart';
  dViaProduct: DiscountProduct[] = [];
  badgeValue =  this.commonService.badgeCountValue;
  constructor(private menu: MenuController, private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private mCtrl:ModalController
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
    this.commonService.showLoader()
    this.apiService.setDistributorHeader();
    if (this.fromView === 'distributor') {
      this.apiService.postDataService(this.apiService.getDistributorProduct, { StockistCerpCode: this.distributor.stockistCerpCode }).subscribe(
        (response) => {
          this.commonService.hideLoader();
          console.log("product distributor :", response)
          this.dProductList = response.distributorList;
          this.commonService.hideLoader();
          this.setProductData();
          this.getDiscount();
        },
        (error) => {
          this.commonService.hideLoader();
          this.commonService.showToast(error);
        }
      )
    } else {
      this.apiService.getDataService(this.apiService.getProductURL).subscribe(
        (response) => {
          console.log("response :", response);
          this.commonService.hideLoader()
          this.productList = response.gskProdList;
          this.storageService.setProductData(this.productList);
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
        prod.salebleQty = ele.salebleQty;
        prod.pI_URL = ele.pI_URL;
        if (ele.stokiestRate > 0) {
          prod.ptr = ele.stokiestRate.toString();
        } else {
          prod.ptr = ele.ptr.toString();
        }
        this.productList.push(prod);
      }
    )
  }
  getDiscount() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.getDiscount).subscribe(
      (response) => {
        console.log("get Discount data :", JSON.stringify(response));
        this.discountInfo = response;
        console.log("get Discount data from list:", JSON.stringify(this.discountInfo));
        this.storageService.setProductDiscount(this.discountInfo);
        this.commonService.hideLoader();
        this.setDiscountData();
      },
      (error) => {
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
        this.discountInfo.disPercentWithProdList.map(
          (innerEle) => {
            if (ele.productCode === innerEle.gskProductCode) {
              discountItem.isPercentDiscount = true;
              discountItem.isDiscount = true;
              discountItem.pDiscount = innerEle.gskDisPercentList;
            }
          }
        )
        if (discountItem.isPercentDiscount == false) {
          this.discountInfo.gskDisPerUnitPerProd.map(
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
          cartProd.productImage = '';
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
          if (this.fromView == 'distributor') {
            this.router.navigate(['/cart', { stockiest: JSON.stringify(this.distributor), fromView: this.fromView, fromEvent: this.fromEvent }]);
          } else {
            this.router.navigate(['/cart', { fromView: this.fromView, fromEvent: this.fromEvent }]);
          }
        },
        (error) => {
          this.commonService.showToast(error);
          this.commonService.hideLoader()
          console.log("error :", error);
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
          cartProd.mrp = parseFloat(ele.ptr);
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
   console.log("pdf :",prod.pI_URL);
  const pdfModel = await this.mCtrl.create({
    component:PdfViewerComponent,
    cssClass:'pdf-style',
    componentProps: {
      'url': prod.pI_URL,
    }
  });
  return await pdfModel.present();
  }
}
