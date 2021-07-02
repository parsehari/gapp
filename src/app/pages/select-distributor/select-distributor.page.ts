import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-select-distributor',
  templateUrl: './select-distributor.page.html',
  styleUrls: ['./select-distributor.page.scss'],
})
export class SelectDistributorPage implements OnInit {
  quantity=0;
  distributor: any = 'Distributor 2';
  constructor(private route: Router, private menu: MenuController) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  selectDistributor(event) {

  }

  continueClicked() {
    this.route.navigate(['/order-summary']);
  }
  cancel() {
    this.route.navigate(['product-list']);
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
