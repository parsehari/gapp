import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDistributorPageRoutingModule } from './select-distributor-routing.module';

import { SelectDistributorPage } from './select-distributor.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDistributorPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [SelectDistributorPage]
})
export class SelectDistributorPageModule {}
