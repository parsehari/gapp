import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  constructor(private menu : MenuController,private route :Router) { }

  ngOnInit() {
    this.menu.enable(true);
  }

  searchInputValueChange(event){
  console.log("change",event);
  }
  addToCart(){

  }
  buyNow(){
    this.route.navigate(['/cart']);
  }
}
