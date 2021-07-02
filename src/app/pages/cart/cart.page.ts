import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  quantity=0;
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
  modifyQuantity(event){
    console.log("vnbbnvnvb")
    if(event === 'add'){
        this.quantity ++ ;
    }else{
     if(this.quantity != 0) 
     this.quantity -- ;
    }
   }
   
   
}
