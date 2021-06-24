import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorDetailsPage } from './distributor-details.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorDetailsPageRoutingModule {}
