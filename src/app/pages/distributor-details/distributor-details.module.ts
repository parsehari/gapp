import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorDetailsPageRoutingModule } from './distributor-details-routing.module';

import { DistributorDetailsPage } from './distributor-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorDetailsPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [DistributorDetailsPage]
})
export class DistributorDetailsPageModule {}
