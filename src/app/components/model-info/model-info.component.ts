import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.scss'],
})
export class ModelInfoComponent implements OnInit {
  loginData: any;
  termsConditionText: any;
  loginType: any;
  constructor(private modalController: ModalController, private apiService: ApiService, private route: Router, private navparams: NavParams, private storageService: StorageService, private commonService: CommonService) { }

  ngOnInit() {
    console.log("this.navparams.data.pdfPath ", this.navparams.data.loginInput);
    this.loginData = this.navparams.data.loginInput;
    this.loginType = this.navparams.data.loginType;
    this.getTerms();
  }

  dismissModel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  goToProductList() {
    this.commonService.showLoader();
    var data = {
      "HcpCode": this.storageService.getHcpCode(),
      "TncFlag": "1"
    };
    console.log(data);
    this.apiService.postDataService(this.apiService.insertTnC, data)
      .subscribe((resp: any) => {
        console.log("response ", resp);
        this.commonService.hideLoader();
        this.processTncSuccess(resp);
      }, (err) => {
        this.commonService.hideLoader();
        this.processTncError(err);
      });
  }

  processTncSuccess(data: any) {
    this.dismissModel();
    this.route.navigate(["/otp", { loginData: this.loginData, type: this.loginType }]);
  }

  processTncError(error: any) {

  }


  getTerms() {
    this.apiService.getDataService(this.apiService.GetTncDetails).subscribe((resp: any) => {
      this.processTermsSuccess(resp);
    }, (err) => {
      console.log("err native", err)
      this.processTermsError(err);
    });
  }

  processTermsSuccess(data) {
    console.log(data);
    this.termsConditionText = data.termsConditinDetails.description;
  }

  processTermsError(data) {
    console.log(data);
  }


}
