import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-view-modal',
  templateUrl: './order-view-modal.page.html',
  styleUrls: ['./order-view-modal.page.scss'],
})
export class OrderViewModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
