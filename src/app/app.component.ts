import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any;
  public appToken: any;

  constructor(private translate: TranslateService,
    private menu: MenuController,
    private storageService: StorageService,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService

  ) {
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en').subscribe((result: any) => {
      this.loadMenu();
    });
    this.storageService.get('token').then((respToken: any) => {
      this.storageService.get('hcpCode').then((respHCP: any) => {
        this.appToken = respToken;
        this.apiService.acces_token = this.appToken;
        this.storageService.setHcpCode(respHCP);
        this.apiService.setDistributorHeader();
        if (this.appToken) {
          this.router.navigate(['product-list']);
        }
      })
    });
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
    console.log("url ", url);
    // this.commonService.showLoader();
    if (url == "login") {
      console.log("login called ");
      this.apiService.getDataService(this.apiService.logout).subscribe((resp: any) => {
        console.log("response ", resp);
        //  this.commonService.hideLoader();
        if (resp.code == "200") {
          this.storageService.clearData().then((respn: any) => {
            this.commonService.showToast(resp.message);
          });
        } else {
          this.commonService.showToast(resp.message);
        }
      }, (err) => {
        // this.commonService.hideLoader();
        console.log("error ", err);
      })
    }
  }
}
