import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {OrderRoutingModule} from "./order-routing.module";
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import { OrderOutcomeComponent } from './order-outcome/order-outcome.component';
import {OrderStoreComponent} from "./order-store/order-store.component";
import {OrderListComponent} from "./order-list/order-list.component";
import {SharedModule} from "../../shared/shared.module";
import {OrderLostComponent} from "./order-lost-list/order-lost.component";



@NgModule({
  declarations: [
    OrderDetailComponent,
    OrderOutcomeComponent,
    OrderStoreComponent,
    OrderListComponent,
    OrderLostComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class OrderModule { }
