import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderByDistributorPage } from './order-by-distributor.page';

const routes: Routes = [
  {
    path: '',
    component: OrderByDistributorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderByDistributorPageRoutingModule {}
