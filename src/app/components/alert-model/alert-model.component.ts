import { Component, OnInit } from '@angular/core';
import { IonicSafeString, ModalController, NavParams, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-alert-model',
  templateUrl: './alert-model.component.html',
  styleUrls: ['./alert-model.component.scss'],
})
export class AlertModelComponent implements OnInit {
  showFilter: boolean = false;
  selectedValue: any;
  maxDate: any;
  minDate: any;
  productsData: any;
  startDate: any;
  endDate: any;
  selectedProd: any;
  productselectedValue: any;

  constructor(
    private commonService:CommonService,
    private apiService:ApiService,
    private platform:Platform,private modalController: ModalController, private navParams: NavParams, private storageService: StorageService) {
    if (this.navParams.data.type == "order") {
      this.showFilter = true;
    }
  }


  ngOnInit() {
    this.productsData = this.storageService.getProductData();
    let sixmnths = moment();
    sixmnths = sixmnths.subtract(180, "days");
    this.maxDate = new Date(sixmnths.format("YYYY/MM/DD")).toISOString();
    this.minDate = new Date().toISOString();
  }
  closeModal() {
    if(!this.showFilter){
      navigator['app'].exitApp();
      this.modalController.dismiss({
        'dismissed': true
      });
    }else{
      this.modalController.dismiss({
        'dismissed': true
      });
    }    
  }

  selectValue(ev) {
    this.selectedValue = ev.detail.value;
  }
  productSelect(ev) {
    this.productselectedValue = ev.detail.value;
  }

  showDate(ev, type) {
    if (type == "start") {
      this.startDate = ev.detail.value;
      this.startDate = moment(this.startDate).format("MM-DD-YYYY");
    }
    else {
      this.endDate = ev.detail.value;
      this.endDate = moment(this.endDate).format("MM-DD-YYYY");
    }
 
  }

  applyFilter() {
    var filter = {
      'orderStatus': this.selectedValue,
      'startDate': this.startDate,
      'endDate': this.endDate,
      'productsData': this.productselectedValue,
      'apply': true
    }
    this.modalController.dismiss(filter);
  }
  acceptPolicy(event){
  if(event.detail.checked){
    const reqJson = {
      "imei":this.commonService.uniqueDeviceId,
      "Privicyflag":"true"
  }
    this.commonService.showLoader();
    this.apiService.postDataService(this.apiService.insertPrivacyPolicy,reqJson).subscribe((res)=>{
     console.log("insert response :",res);
     this.commonService.hideLoader();
     this.modalController.dismiss({
      'dismissed': true
    });
    },(error)=>{
      this.commonService.showToast(error);
      this.commonService.hideLoader();
    })
  }
  }
}
