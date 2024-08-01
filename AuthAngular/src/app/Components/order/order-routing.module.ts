import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderDetailComponent} from "./order-detail/order-detail.component";
import {OrderStoreComponent} from "./order-store/order-store.component";
import {OrderOutcomeComponent} from "./order-outcome/order-outcome.component";
import {OrderListComponent} from "./order-list/order-list.component";
import {OrderLostComponent} from "./order-lost-list/order-lost.component";

const routes: Routes = [
  {
    path: 'new-order',
    component: OrderDetailComponent,
    title: 'Новый заказ'
  },
  {
    path: 'order/:id',
    component: OrderDetailComponent,
    title: 'Home details'
  },
  {
    path: 'order-store',
    component: OrderStoreComponent,
    title: 'Home details'
  },
  {
    path: 'order-outcome',
    component: OrderOutcomeComponent,
    title: 'Home details'
  },
  {
    path: 'order-list',
    component: OrderListComponent,
    title: 'Order-list'
  },
  {
    path: 'order-lost',
    component: OrderLostComponent,
    title: 'Order-lost'
  },
  // { path: '', redirectTo: '/order-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
