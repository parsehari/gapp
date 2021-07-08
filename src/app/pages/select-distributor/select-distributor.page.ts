import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CartWithStockiest } from 'src/app/Model/cart-with-pstockiest.model';
import { CartModel } from 'src/app/Model/cart.model';
import { Product } from 'src/app/Model/product.model';
import { StockiestPrice } from 'src/app/Model/stockiest-price.model';
import { Stockiest } from 'src/app/Model/stockiest.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-select-distributor',
  templateUrl: './select-distributor.page.html',
  styleUrls: ['./select-distributor.page.scss'],
})
export class SelectDistributorPage implements OnInit {
  stockiestId: string;
  selectedIndex = 0;
  distributor: any = 'Distributor 2';
  cartData: CartModel[];
  cartWithPDistributor: CartWithStockiest[] = [];
  stockiestPrice: StockiestPrice;
  constructor(private router: Router, private menu: MenuController,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.route.params.subscribe(
      (param) => {
        if (param['param']) {
          this.cartData = JSON.parse(param['param']);
          console.log("cart data :", this.cartData);
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
    this.stockiestId = this.stockiestPrice.distributor1_List[0].stockiest1;
    this.cartData.map(
      (ele) => {
        var cartWithStockiest = new CartWithStockiest();
        cartWithStockiest.unitCart = ele;
        this.stockiestPrice.distributor1_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              if (innerEle.stokiestRate > 0) {
                innerEle.unitDisplayPrice = innerEle.stokiestRate;
              } else {
                innerEle.unitDisplayPrice = innerEle.prt;
              }
              innerEle.totalDisplayPrice = innerEle.unitDisplayPrice * ele.quantity;
              cartWithStockiest.stockiestOne = innerEle;
            }
          }
        )
        this.stockiestPrice.distributor2_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              if (innerEle.stokiestRate > 0) {
                innerEle.unitDisplayPrice = innerEle.stokiestRate;
              } else {
                innerEle.unitDisplayPrice = innerEle.prt;
              }
              innerEle.totalDisplayPrice = innerEle.unitDisplayPrice * ele.quantity;

              cartWithStockiest.stockiestTwo = innerEle;
            }
          }
        )
        this.stockiestPrice.distributor3_List.map(
          (innerEle) => {
            if (ele.productCode === innerEle.productCode) {
              if (innerEle.stokiestRate > 0) {
                innerEle.unitDisplayPrice = innerEle.stokiestRate;
              } else {
                innerEle.unitDisplayPrice = innerEle.prt;
              }
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
    this.router.navigate(['/order-summary', { stockiest: this.stockiestId, cartInfo: JSON.stringify(this.cartWithPDistributor), fromView: 'cart' }]);
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
  }
}
