import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CartModel } from 'src/app/Model/cart.model';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-select-distributor',
  templateUrl: './select-distributor.page.html',
  styleUrls: ['./select-distributor.page.scss'],
})
export class SelectDistributorPage implements OnInit {
  quantity=0;
  distributor: any = 'Distributor 2';
  cartData: CartModel[];
  constructor(private router: Router, private menu: MenuController,
    private route : ActivatedRoute,
    private apiService:ApiService
    ) {
      this.route.params.subscribe(
        (param)=>{
          if(param['param']){
            this.cartData = JSON.parse(param['param']);
            console.log("cart data :", this.cartData);
          }
        }
      )    
    }

  ngOnInit() {
   this.apiService.getDataService(this.apiService.getPDistributorPrice).subscribe(
     (response)=>{
      console.log("price :",response);
     },
     (error)=>{

     }
   )
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  selectDistributor(event) {

  }

  continueClicked() {
    this.router.navigate(['/order-summary']);
  }
  cancel() {
    this.router.navigate(['product-list']);
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
