import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { PreferredDistributorModel } from 'src/app/Model/pdistributor.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-preferred-distributor',
  templateUrl: './preferred-distributor.page.html',
  styleUrls: ['./preferred-distributor.page.scss'],
})
export class PreferredDistributorPage implements OnInit {
  pDistributorList: PreferredDistributorModel[];
  selDistributor=[];
  searchStr="";
  constructor(private route:Router, private menu : MenuController,private apiService:ApiService,private storage:StorageService,
   private commonService:CommonService) { }
  
  ngOnInit() {
     this.menu.enable(true);
     this.commonService.showLoader();
     this.apiService.setDistributorHeader();
     this.apiService.getDataService(this.apiService.getDistributorURL).subscribe((response)=>{
      this.pDistributorList = response.gskDistributorList;
      console.log("this.pDistributorList :",this.pDistributorList);
      this.pDistributorList.map(
         (ele)=>{
            if(ele.preference.length >0){
               ele.isPreferred = true;
               this.selDistributor.push(ele.stockistCerpCode);
            }
         }
      )
      this.commonService.hideLoader();
     }),
     (error)=>{
        this.commonService.hideLoader()
        this.commonService.showToast(error);
     }
  }
  goBack(){

  }
  searchInputValueChange(str){
   this.searchStr = str;
  }
  onPress(stockCode) {
   var count = 0; 
   var isSelected=false;
   this.pDistributorList.map((ele)=>{
      if(ele?.preference?.length > 0){
        count++;
     }
     if(ele.stockistCerpCode === stockCode && ele?.preference?.length > 0){
      ele.preference = "";
      isSelected = true;
      this.selDistributor = this.selDistributor.filter((ele)=>{
         return ele != stockCode
      })
      return;
   }
   })
   if(isSelected){
      return;
   }
 if(count < 3){
    this.pDistributorList.map((ele)=>{
       if(ele.stockistCerpCode === stockCode){
           ele.preference = "preference";
           this.selDistributor.push(ele.stockistCerpCode);
       }
     })
 }else{
    this.commonService.presentOneButtonAlert('GSK','You can not select more then three preferred distributor','OK');
 }   
}

  goToDetail(index){
     this.route.navigate(['/distributor-details',{data:JSON.stringify(this.pDistributorList[index])}]);
  }
  savePressed(){
     if(this.selDistributor.length == 0){
      this.commonService.presentOneButtonAlert('GSK','Please select at least one distributor','OK');

     }else{
      var dict = this.setJsonForPreferredDistributor();
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.insertDistributorURL,dict).subscribe(
         (response)=>{
          this.commonService.hideLoader();
          this.route.navigate(['/product-list'])
         },
         (error)=>{
           this.commonService.hideLoader();
           this.commonService.showToast(error)
         }
      )
     }
  }
  setJsonForPreferredDistributor():any{
   var jsonDict = {
      "HcpCode": this.storage.getHcpCode(),
     }
     var count : number = 1;
   this.selDistributor.map((ele)=>{
      
      jsonDict['Stockiest'+ count] = ele;
      count++;
   })
     return jsonDict;
  }
}
