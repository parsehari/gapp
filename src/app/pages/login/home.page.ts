import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModelInfoComponent } from 'src/app/components/model-info/model-info.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //public loginInput: string = '9650058176';
  public loginInput: string = 'mohdyasar87@gmail.com';
  public inputType: string = 'email';
  public loginType: string;

  constructor(private modelCtrl: ModalController, private menu: MenuController, private route: Router,
    private commonService: CommonService, private apiService: ApiService, private storageService: StorageService) {
    this.menu.enable(false);

  }

  ngOnInit() {
  }

  inputVal(type: any) {
    this.loginType = type;
  }

  doLogin() {
    this.commonService.showLoader();
    if (!this.loginInput) {
      this.commonService.showToast("Enter registered Mobile No. or Email Id");
      return;
    }
    this.apiService.setLoginHeader();
    var data = {
      "EmailId": "",
      "MobileNo": ""
    }
    if (this.inputType == 'email') {
      data.EmailId = this.loginInput;
      data.MobileNo = ""
    } else {
      data.EmailId = "";
      data.MobileNo = this.loginInput;
    }
    this.apiService.postDataService(this.apiService.loginAPI, data)
      .subscribe((resp: any) => {
        console.log("response ", resp);
        this.processLoginSuccess(resp);
      }, (err) => {
        this.processLoginError(err);
      });
  }

  async showTermsAndConditions() {
    const model = await this.modelCtrl.create({
      component: ModelInfoComponent,
      componentProps: {
        "loginInput": this.loginInput,
        "loginType": this.inputType
      }
    })
    return await model.present();
  }

  processLoginSuccess(data: any) {
    console.log("success data ", data);
    this.commonService.hideLoader();
    if (data.hcpCode) {
      this.storageService.setHcpCode(data.hcpCode);
      if (!data.tncFlag)
        this.showTermsAndConditions();
      else
        this.route.navigate(["/otp", { loginData: this.loginInput, type: this.inputType }]);
    } else {
      this.commonService.showToast(data.message);
    }
  }

  processLoginError(error: any) {
    console.log("error ", error);
    this.commonService.hideLoader();
    if (error.status == 400) {
      this.commonService.showToast("Mobile No must be numeric and 10 digits");
    }
    // this.commonService.showToast(error.errors.MobileNo[0]);
  }


}
