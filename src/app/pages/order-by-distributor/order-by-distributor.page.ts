import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { PreferredDistributorPageModule } from '../preferred-distributor/preferred-distributor.module';

@Component({
  selector: 'app-order-by-distributor',
  templateUrl: './order-by-distributor.page.html',
  styleUrls: ['./order-by-distributor.page.scss'],
})
export class OrderByDistributorPage implements OnInit {
  pDistributorList: PreferredDistributorModel[];
  selDistributor=[];
  searchStr = "";
  constructor(private storage:StorageService,private route:Router, private menu : MenuController,private apiService:ApiService,
   private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.showLoader();
    this.apiService.setDistributorHeader();
    this.apiService.getDataService(this.apiService.getDistributorURL).subscribe((response)=>{
     this.pDistributorList = response.gskDistributorList;
     this.commonService.hideLoader();
    
    }),
    (error)=>{
       this.commonService.hideLoader()
       this.commonService.showToast(error);
    }
  }
  goBack(){

  }
  searchbarChanged(str){
    this.searchStr = str;
  }
 async getProduct(distributor:PreferredDistributorModel){
    if(distributor.isBuyer === "false"){
  const requestJson = {
    stockistCerpCode: distributor.stockistCerpCode,
    stkName:distributor.stkName,
    stkMobileNo:distributor.stkMobile,
    stkEmail:distributor.stkEmail,
    hcpCode: this.storage.hcpCode,
    hcpName: this.storage.userName,
    hcpMobileNo: this.storage.userMobile,
    hcpEmail: this.storage.userEmail
   }

   const alert = await this.commonService.presentAlertConfirm("GSK",distributor.stkName+" is not your buyer!! do you still want to continue.","Yes","No");
  console.log("alert :",alert);
  if(alert === "Yes"){
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.mailtoDistributor,requestJson).subscribe((res)=>{
    console.log("response :",res);
    this.commonService.hideLoader();
     if(res.code === "200"){
     this.commonService.presentOneButtonAlert("GSK","A mail has been sent to "+distributor.stkName,"OK");
    }
    },(err)=>{
      this.commonService.hideLoader();
    })
  }
    

    }else{
      this.route.navigate(['/product-list',{distributor:JSON.stringify(distributor),fromView:'distributor'}])
    }
  }
}
