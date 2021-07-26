import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { rejects } from 'assert';
import { resolve } from 'path';
import { promise } from 'protractor';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { Events } from './events';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private uniqueDeviceID:UniqueDeviceID,private commonService :CommonService,private event:Events, private router : Router, private storageService : StorageService, private apiService : ApiService) { 

  }

 async canActivate(): Promise<boolean  | boolean> {
 await this.getUniqueDevice();
  const response = await this.getPolicyFlag(); 
  console.log("ploicy response :",response);
  if(response.code === '819'){
    this.commonService.showPrivacyFlag = true;
    return true;
  }else{
    if(response?.privicyflag === "true"){
      const months = this.monthDiff(new Date(response.createdOn),new Date(response.currentDate));
     console.log("month diff",months);
      if(months > 6){
        this.commonService.showPrivacyFlag = true;
        return true;
      }else{
        this.storageService.get('token').then((respToken: any) => {
          this.storageService.get('hcpCode').then((respHCP: any) => {
            console.log("token :", respToken);
          if(respToken != undefined){
            console.log("inside token");
            this.apiService.acces_token = respToken;
            this.storageService.setHcpCode(respHCP);
            this.apiService.setDistributorHeader();
            this.commonService.badgeCountValue = 0;
            this.storageService.get('userName').then((name)=>{
              this.event.publish('SET_USER',{user:name});
              this.router.navigate(['/product-list']);
              return false;
            })
          }})
        })
      }
    }
  }
  return true;    
  }
  getUniqueDevice(){
  return new Promise((resolve)=>{
    this.uniqueDeviceID.get().then((uuid:any)=>{
      this.commonService.uniqueDeviceId = uuid;
      resolve(uuid);
    }).catch((error)=>{
      this.commonService.uniqueDeviceId = "";
      console.log("error in device id :",error);
    }
      )
  })  
  
  }

  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
async getPolicyFlag(){
  this.apiService.setLoginHeader()
  const imeiJson = {
      "imei":this.commonService.uniqueDeviceId
    }
    console.log("imeiJson :",imeiJson);
  return  this.apiService.postDataService(this.apiService.privacyPolicy,imeiJson).toPromise();
}
}
