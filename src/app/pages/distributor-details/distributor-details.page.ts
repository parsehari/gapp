import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';

@Component({
  selector: 'app-distributor-details',
  templateUrl: './distributor-details.page.html',
  styleUrls: ['./distributor-details.page.scss'],
})
export class DistributorDetailsPage implements OnInit {
  distributor:PreferredDistributorModel;
  constructor(private menu: MenuController, private router: Router,private route:ActivatedRoute) { 
   
  // this.distributor = JSON.parse(this.route.snapshot.params())
  this.route.params.subscribe(params => {
    if(params['data']){
      this.distributor = JSON.parse(params['data']);
     
    }    
  })
}

  ngOnInit() {
    this.menu.enable(true)
  }
  goBack() {

  }
  saveDistributor() {
    this.router.navigate(['product-list']);
  }
}
