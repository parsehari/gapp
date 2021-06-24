import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-distributor-details',
  templateUrl: './distributor-details.page.html',
  styleUrls: ['./distributor-details.page.scss'],
})
export class DistributorDetailsPage implements OnInit {

  constructor(private menu : MenuController) { }

  ngOnInit() {
    this.menu.enable(true)
  }
  goBack(){
    
  }
}
