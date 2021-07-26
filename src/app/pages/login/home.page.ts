import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertModelComponent } from 'src/app/components/alert-model/alert-model.component';
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
  public loginInput: string = '';
  //public loginInput: string = 'harshada.v.wabgaonkar@gsk.com';
  public inputType: string = 'number';
  public loginType: string;
  
  constructor(private modelCtrl: ModalController, private menu: MenuController, private route: Router,
    private commonService: CommonService, private apiService: ApiService,
    private storageService: StorageService,
    private model: ModalController) {
    this.menu.enable(false);
    
  }
  async presentModal() {
    const modal = await this.model.create({
      component: AlertModelComponent,
      cssClass: 'alert-custom-class'
    });
    return await modal.present();
  }
  ngOnInit() {
    console.log("this.commonService.showPrivacyFlag",this.commonService.showPrivacyFlag)
   if(this.commonService.showPrivacyFlag){
     console.log("inside flag")
     this.presentModal()
   }
  }

  inputVal(type: any) {
    this.loginType = type;
  }

  validateInput ():boolean {
    var regValid = /^\d{10}$/;
    if(this.loginInput.match(regValid)){
      return true;
    }else{
      regValid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(regValid.test(this.loginInput)){
       return true;
      }else{
         return false;
      }
    }
  }
  doLogin() {
    if (!this.validateInput()) {
      this.commonService.showToast("Enter registered Mobile No. or Email Id");
      return;
    }
    this.commonService.showLoader();
    this.apiService.setLoginHeader();
    var data = {
      "Mobile_Email": this.loginInput,
      //  "MobileNo": ""
    }
    // if (this.inputType == 'email') {
    //   data.EmailId = this.loginInput;
    //   data.MobileNo = ""
    // } else {
    //   data.EmailId = "";
    //   data.MobileNo = this.loginInput;
    // }

    this.apiService.postDataService(this.apiService.loginAPI, data)
      .subscribe((resp: any) => {
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
    this.commonService.hideLoader();
    if (data.hcpCode) {
      this.storageService.setHcpCode(data.hcpCode);
      this.storageService.set('hcpCode', data.hcpCode);
      this.storageService.userEmail = data.email;
      this.storageService.userMobile = data.mobileNo;
      if (this.loginType === 'email') {
        this.storageService.otpOnemail = true;
      } else {
        this.storageService.otpOnemail = false;
      }

      if (data.tncFlag == "true") {
        this.route.navigate(["/otp", { loginData: this.loginInput, type: this.inputType }]);
      }
      else {
        this.showTermsAndConditions();
      }
    } else {
      if (data.code === '801' || data.code === '802') {
        this.commonService.showToast('Please enter registered mobile/email address.');
      } else {
        if (data.code === '816') {
          this.commonService.showToast('Please enter valid mobile/email address.');
        } else {
          this.commonService.showToast(data.message);
        }
      }
    }
  }

  processLoginError(error: any) {
    this.commonService.hideLoader();
    if (error.status == 400) {
      this.commonService.showToast("Mobile No must be numeric and 10 digits");
    }
  }


}
