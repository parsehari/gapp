import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDistributorPage } from './select-distributor.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDistributorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDistributorPageRoutingModule {}
