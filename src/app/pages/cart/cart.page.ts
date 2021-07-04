import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  quantity = 0;
  cartProducts: any;
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
    this.route.navigate(['/select-distributor'])
  }
  addNewProduct() {
    this.route.navigate(['/product-list'])
  }
  modifyQuantity(event) {
    console.log("vnbbnvnvb")
    if (event === 'add') {
      this.quantity++;
    } else {
      if (this.quantity != 0)
        this.quantity--;
    }
  }


}
