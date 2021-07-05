import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { PreferredDistributorPageModule } from '../preferred-distributor/preferred-distributor.module';

@Component({
  selector: 'app-order-by-distributor',
  templateUrl: './order-by-distributor.page.html',
  styleUrls: ['./order-by-distributor.page.scss'],
})
export class OrderByDistributorPage implements OnInit {
  masterData:PreferredDistributorModel[];
  pDistributorList: PreferredDistributorModel[];
  selDistributor=[];
  constructor(private route:Router, private menu : MenuController,private apiService:ApiService,
   private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.showLoader();
    this.apiService.setDistributorHeader();
    this.apiService.getDataService(this.apiService.getDistributorURL).subscribe((response)=>{
     this.pDistributorList = response.gskDistributorList;
     this.masterData = response.gskDistributorList;
     this.commonService.hideLoader();
    }),
    (error)=>{
       this.commonService.hideLoader()
       this.commonService.showToast(error);
    }
  }
  goBack(){

  }
  searchbarChanged(){
    
  }
}
