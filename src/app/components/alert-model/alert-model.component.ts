import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
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

  constructor(private modalController: ModalController, private navParams: NavParams, private storageService: StorageService) {
    console.log('type', this.navParams.data.type);
    if (this.navParams.data.type == "order") {
      this.showFilter = true;
    }
  }


  ngOnInit() {
    this.productsData = this.storageService.getProductData();
    console.log("this.productsData ", this.productsData);
    let sixmnths = moment();
    sixmnths = sixmnths.subtract(180, "days");
    this.maxDate = new Date(sixmnths.format("YYYY/MM/DD")).toISOString();
    this.minDate = new Date().toISOString();
  }
  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  selectValue(ev) {
    this.selectedValue = ev.detail.value;
  }
  productSelect(ev) {
    this.productselectedValue = ev.detail.value;
  }

  showDate(ev, type) {
    console.log("type", type);
    if (type == "start") {
      this.startDate = ev.detail.value;
      this.startDate = moment(this.startDate).format("MM-DD-YYYY");
    }
    else {
      this.endDate = ev.detail.value;
      this.endDate = moment(this.endDate).format("MM-DD-YYYY");
    }
    console.log("this.startDate ", this.startDate);
    console.log("this.startDate ", this.endDate);
  }

  applyFilter() {
    console.log('selectedValue ', this.selectedValue);
    console.log('productsData ', this.productselectedValue);
    console.log('startDate ', this.startDate);
    console.log('endDate ', this.endDate);
    var filter = {
      'orderStatus': this.selectedValue,
      'startDate': this.startDate,
      'endDate': this.endDate,
      'productsData': this.productselectedValue,
      'apply': true
    }
    this.modalController.dismiss(filter);
  }
}
