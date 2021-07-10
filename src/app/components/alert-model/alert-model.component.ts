import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-alert-model',
  templateUrl: './alert-model.component.html',
  styleUrls: ['./alert-model.component.scss'],
})
export class AlertModelComponent implements OnInit {
  showFilter: boolean = false;
  selectedValue: any;
  constructor(private modalController: ModalController, private navParams: NavParams) {
    console.log(this.navParams.data.type);
    if (this.navParams.data.type == "order") {
      this.showFilter = true;
    }
  }


  ngOnInit() { }
  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  selectValue(ev) {
    console.log("ev ", ev.detail.value);
    this.selectedValue = ev.detail.value;
  }

  applyFilter() {
    console.log(this.selectedValue);
    this.modalController.dismiss(this.selectedValue);
  }
}
