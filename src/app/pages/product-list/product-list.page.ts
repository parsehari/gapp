import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  quantity=0;
  constructor(private menu : MenuController,private route :Router) { }

  ngOnInit() {
    this.menu.enable(true);
  }

  searchInputValueChange(event){
  console.log("change",event);
  }
  addToCart(){
    this.route.navigate(['/cart']);
  }
  buyNow(){
    this.route.navigate(['/select-distributor']);
  }
  modifyQuantity(event){
   if(event === 'add'){
       this.quantity ++ ;
   }else{
    if(this.quantity != 0) 
    this.quantity -- ;
   }
  }
}
