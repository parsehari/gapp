import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { OrderViewModalPage } from 'src/app/pages/order-view-modal/order-view-modal.page';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  constructor(private modelCtrl: ModalController, private menu: MenuController) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {

  }

  async viewDetails() {
    const model = await this.modelCtrl.create({
      component: OrderViewModalPage,
      cssClass: 'my-custom-modal-css'
    })
    return await model.present();

  }


}
