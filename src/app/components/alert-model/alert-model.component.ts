import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-model',
  templateUrl: './alert-model.component.html',
  styleUrls: ['./alert-model.component.scss'],
})
export class AlertModelComponent implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {}
  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
