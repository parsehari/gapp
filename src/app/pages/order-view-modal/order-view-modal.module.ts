import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderViewModalPageRoutingModule } from './order-view-modal-routing.module';

import { OrderViewModalPage } from './order-view-modal.page';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderViewModalPageRoutingModule
  ],
  declarations: [OrderViewModalPage]
})
export class OrderViewModalPageModule { }
