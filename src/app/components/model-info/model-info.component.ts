import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.scss'],
})
export class ModelInfoComponent implements OnInit {

  constructor(private modalController : ModalController) { }

  ngOnInit() {}
  dismissModel(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
