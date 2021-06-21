import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferredDistributorPage } from './preferred-distributor.page';

const routes: Routes = [
  {
    path: '',
    component: PreferredDistributorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferredDistributorPageRoutingModule {}
