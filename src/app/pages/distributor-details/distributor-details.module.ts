import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorDetailsPageRoutingModule } from './distributor-details-routing.module';

import { DistributorDetailsPage } from './distributor-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorDetailsPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [DistributorDetailsPage]
})
export class DistributorDetailsPageModule {}
