import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-order-view-modal',
  templateUrl: './order-view-modal.page.html',
  styleUrls: ['./order-view-modal.page.scss'],
})
export class OrderViewModalPage implements OnInit {
  orderViewDetail: any;
  orderViewDetailInfo: any;

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {

    this.orderViewDetail = this.navParams.data.data;
    this.orderViewDetailInfo = this.navParams.data.detail;

   
  }

  dismissModel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
