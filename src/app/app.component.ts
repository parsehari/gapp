import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, Platform } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';
import { Events } from './services/events';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any;
  public appToken: any;
  userName = "";
  constructor(private translate: TranslateService,
    private menu: MenuController,
    private storageService: StorageService,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private events:Events,
    private uniqueDeviceId:UniqueDeviceID,
    private platform:Platform

  ) {
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en').subscribe((result: any) => {
      this.loadMenu();
    });
    
      this.events.subscribe('SET_USER',(info:any)=>{
        this.userName = info.user;
        this.storageService.userName = this.userName;
      })
     
  }

 
  loadMenu() {
    this.appPages = [
      { title: this.translate.instant("sideMenu.placeOrder"), url: 'product-list', icon: 'mail' },
      { title: this.translate.instant("sideMenu.obyD"), url: 'order-by-distributor', icon: 'paper-plane' },
      { title: this.translate.instant("sideMenu.mPreD"), url: 'preferred-distributor', icon: 'heart' },
      { title: this.translate.instant("sideMenu.myOrder"), url: 'my-orders', icon: 'archive' },
      { title: this.translate.instant("sideMenu.logout"), url: 'login', icon: 'log-out' }
    ];

  }
  logout(url: any) {
    // this.commonService.showLoader();
    if (url == "login") {
      this.apiService.getDataService(this.apiService.logout).subscribe((resp: any) => {
        //  this.commonService.hideLoader();
        if (resp.code == "200") {
          this.storageService.clearData().then((respn: any) => {
            this.commonService.showToast(resp.message);
            this.router.navigate(['/'+url]);
          });
        } else {
          this.commonService.showToast(resp.message);
        }
      }, (err) => {
        // this.commonService.hideLoader();
      })
    }else{
      this.router.navigate(['/'+url]);
    }
  }
}
