import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListPageRoutingModule } from './product-list-routing.module';

import { ProductListPage } from './product-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FilterPipe } from 'src/app/pipes/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductListPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [ProductListPage],
})
export class ProductListPageModule {}
