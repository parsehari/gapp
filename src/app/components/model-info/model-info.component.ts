import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.scss'],
})
export class ModelInfoComponent implements OnInit {

  constructor(private modalController : ModalController,private route:Router) { }

  ngOnInit() {}
  
  dismissModel(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  goToProductList(){
   this.dismissModel();
   this.route.navigate(["/preferred-distributor"]);
  }
}
