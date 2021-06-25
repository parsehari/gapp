import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  {
    path: 'otp',
    loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpPageModule)
  },
 {
     path: 'product-list',
     loadChildren: () => import('./pages/product-list/product-list.module').then( m => m.ProductListPageModule)
   },
  {
    path: 'select-distributor',
    loadChildren: () => import('./pages/select-distributor/select-distributor.module').then(m => m.SelectDistributorPageModule)
  },
  {
    path: 'preferred-distributor',
    loadChildren: () => import('./pages/preferred-distributor/preferred-distributor.module').then(m => m.PreferredDistributorPageModule)
  },
   {
     path: 'distributor-details',
     loadChildren: () => import('./pages/distributor-details/distributor-details.module').then( m => m.DistributorDetailsPageModule)
   },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'order-by-distributor',
    loadChildren: () => import('./pages/order-by-distributor/order-by-distributor.module').then( m => m.OrderByDistributorPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./pages/my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  }
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
