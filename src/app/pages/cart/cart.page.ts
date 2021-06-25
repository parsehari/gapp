import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  goBack(){
    
  }
  changeQty(){

  }
  continueClicked(){
   this.route.navigate(['/select-distributor'])
  }
  addNewProduct(){
    this.route.navigate(['/product-list'])
  }

}
