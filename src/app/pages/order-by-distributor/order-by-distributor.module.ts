import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderByDistributorPageRoutingModule } from './order-by-distributor-routing.module';

import { OrderByDistributorPage } from './order-by-distributor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderByDistributorPageRoutingModule
  ],
  declarations: [OrderByDistributorPage]
})
export class OrderByDistributorPageModule {}
