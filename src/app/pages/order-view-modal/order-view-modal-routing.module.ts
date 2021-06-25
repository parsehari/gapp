import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderViewModalPage } from './order-view-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OrderViewModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderViewModalPageRoutingModule {}
