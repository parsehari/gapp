import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'otp',
    loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpPageModule)
  },
  /* {
     path: 'product-list',
     loadChildren: () => import('./pages/product-list/product-list.module').then( m => m.ProductListPageModule)
   },*/
  {
    path: 'select-distributor',
    loadChildren: () => import('./pages/select-distributor/select-distributor.module').then(m => m.SelectDistributorPageModule)
  },
  {
    path: 'preferred-distributor',
    loadChildren: () => import('./pages/preferred-distributor/preferred-distributor.module').then(m => m.PreferredDistributorPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./pages/my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
  },
  {
    path: 'order-view-modal',
    loadChildren: () => import('./pages/order-view-modal/order-view-modal.module').then( m => m.OrderViewModalPageModule)
  },
  // {
  //   path: 'distributor-details',
  //   loadChildren: () => import('./pages/distributor-details/distributor-details.module').then( m => m.DistributorDetailsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
