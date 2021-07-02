import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {
  quantity=0;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  addNewProduct() {
    this.router.navigate(['product-list']);
  }

  continue() {
    this.router.navigate(['payment']);
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
