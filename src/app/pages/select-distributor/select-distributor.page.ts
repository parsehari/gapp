import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CartWithStockiest } from 'src/app/Model/cart-with-pstockiest.model';
import { CartModel } from 'src/app/Model/cart.model';
import { Product } from 'src/app/Model/product.model';
import { StockiestPrice } from 'src/app/Model/stockiest-price.model';
import { Stockiest } from 'src/app/Model/stockiest.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-select-distributor',
  templateUrl: './select-distributor.page.html',
  styleUrls: ['./select-distributor.page.scss'],
})
export class SelectDistributorPage implements OnInit {
  sDistributor: Stockiest;
  selectedIndex = 0;
  distributor: any = 'Distributor 2';
  cartData: CartModel[];
  cartWithPDistributor: CartWithStockiest[] = [];
  stockiestPrice: StockiestPrice;
  sDInfoLabel = 'sdistributor.sdistributorPage.selected-distributor-info'
  fromView = 'product-list'
  fromEvent: string = 'aCart';
   badgeCountValue = this.commonService.badgeCountValue;
  constructor(private router: Router, private menu: MenuController,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private commonService:CommonService
  ) {
    this.route.params.subscribe(
      (param) => {
        if (param['param']) {
          this.cartData = JSON.parse(param['param']);
          console.log("cart data :", this.cartData);
        }
        if (param['fromView']) {
          this.fromView = param['fromView'];
          console.log("***********fron view**************", this.fromView);
        } if (param['fromEvent']) {
          this.fromEvent = param['fromEvent'];
          console.log("***********fromEvent**************", this.fromView);
        }
      }
    )
  }

  ngOnInit() {
    this.apiService.getDataService(this.apiService.getPDistributorPrice).subscribe(
      (response) => {
        console.log("price :", response);
        this.stockiestPrice = response;
        console.log("stockiestPrice :", this.stockiestPrice);
        this.setPDistributorData();
      },
      (error) => {

      }
    )
  }

  setPDistributorData() {
    this.cartData.map(
      (ele) => {
        var cartWithStockiest = new CartWithStockiest();
        cartWithStockiest.unitCart = ele;
        this.stockiestPrice.distributor1_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              innerEle.unitDisplayPrice = innerEle.stokiestRate;
              innerEle.totalDisplayPrice = innerEle.unitDisplayPrice * ele.quantity;
              cartWithStockiest.stockiestOne = innerEle;
            }
          }
        )
        this.stockiestPrice.distributor2_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              innerEle.unitDisplayPrice = innerEle.stokiestRate;
              innerEle.totalDisplayPrice = innerEle.unitDisplayPrice * ele.quantity;
              cartWithStockiest.stockiestTwo = innerEle;
            }
          }
        )
        this.stockiestPrice.distributor3_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              innerEle.unitDisplayPrice = innerEle.stokiestRate;
              innerEle.totalDisplayPrice = innerEle.unitDisplayPrice * ele.quantity;
              cartWithStockiest.stockiestThree = innerEle;
            }
          }
        )
        this.cartWithPDistributor.push(cartWithStockiest);
        console.log("cartWithPDistributor :", this.cartWithPDistributor)
      }
    )
  }
  ionViewWillEnter() {
    this.menu.enable(true);
  }

  selectDistributor(event) {
    console.log("select radio :", event);

    let index = parseInt(event.detail.value);
    switch (index) {
      case 0:
        this.sDistributor = this.stockiestPrice.distributor1_List[0] as Stockiest;
        break;
      case 1:
        this.sDistributor = this.stockiestPrice.distributor2_List[0] as Stockiest;
        break;
      case 2:
        this.sDistributor = this.stockiestPrice.distributor3_List[0] as Stockiest;
        break;
    }
    this.sDInfoLabel = 'sdistributor.sdistributorPage.selected-distributor'
  }
  getTotalForPrice(index): number {
    var totalOne = 0;
    var totalTwo = 0;
    var totalThree = 0;

    if (index == 0) {
      this.cartWithPDistributor.map(
        (ele) => {
          if (ele.stockiestOne?.totalDisplayPrice) {
            totalOne = totalOne + ele.stockiestOne?.totalDisplayPrice;
          } else {
            totalOne = totalOne;
          }
        }
      )
      return totalOne;
    } else if (index == 1) {
      this.cartWithPDistributor.map(
        (ele) => {
          if (ele.stockiestTwo?.totalDisplayPrice) {
            totalTwo = totalTwo + ele.stockiestTwo?.totalDisplayPrice;
          } else {
            totalTwo = totalTwo;
          }
        }
      )
      return totalTwo;
    } else {
      this.cartWithPDistributor.map(
        (ele) => {
          if (ele.stockiestThree?.totalDisplayPrice) {
            totalThree = totalThree + ele.stockiestThree?.totalDisplayPrice;
          } else {
            totalThree = totalThree;
          }
        }
      )
      return totalThree;
    }

  }
  getTotalForQuantity(): number {
    var total = 0;
    this.cartWithPDistributor.map(
      (ele) => {
        total += ele.unitCart.quantity;
      }
    )
    return total;
  }
  continueClicked() {
    this.router.navigate(['/order-summary', { stockiest: JSON.stringify(this.sDistributor), cartInfo: JSON.stringify(this.cartWithPDistributor), fromView: this.fromView, fromEvent: this.fromEvent }]);
  }
  cancel() {
    this.router.navigate(['product-list']);
  }
  modifyQuantity(event, index) {

    if (event === 'add') {
      this.cartWithPDistributor[index].unitCart.quantity++;
      this.setPriceForDistributor(index);
    } else {
      if (this.cartWithPDistributor[index].unitCart.quantity != 1)
        this.cartWithPDistributor[index].unitCart.quantity--;
      this.setPriceForDistributor(index);
    }
  }


  setPriceForDistributor(index) {
    if (this.cartWithPDistributor[index].stockiestOne?.unitDisplayPrice) {
      this.cartWithPDistributor[index].stockiestOne.totalDisplayPrice = this.cartWithPDistributor[index].stockiestOne?.unitDisplayPrice * this.cartWithPDistributor[index].unitCart?.quantity;
    }
    if (this.cartWithPDistributor[index].stockiestTwo?.unitDisplayPrice) {
      this.cartWithPDistributor[index].stockiestTwo.totalDisplayPrice = this.cartWithPDistributor[index].stockiestTwo?.unitDisplayPrice * this.cartWithPDistributor[index].unitCart?.quantity;
    }
    if (this.cartWithPDistributor[index].stockiestThree?.unitDisplayPrice) {
      this.cartWithPDistributor[index].stockiestThree.totalDisplayPrice = this.cartWithPDistributor[index].stockiestThree?.unitDisplayPrice * this.cartWithPDistributor[index].unitCart?.quantity;
    }
  }
}
