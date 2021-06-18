import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferredDistributorPageRoutingModule } from './preferred-distributor-routing.module';

import { PreferredDistributorPage } from './preferred-distributor.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferredDistributorPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PreferredDistributorPage]
})
export class PreferredDistributorPageModule {}
