import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.scss'],
})
export class ModelInfoComponent implements OnInit {
  loginData: any;
  constructor(private modalController: ModalController, private route: Router, private navparams: NavParams) { }

  ngOnInit() {
    console.log("this.navparams.data.pdfPath ", this.navparams.data.loginInput);
    this.loginData = this.navparams.data.loginInput;
  }

  dismissModel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  goToProductList() {
    this.dismissModel();
    this.route.navigate(["/otp", { loginData: this.loginData }]);
  }
}
