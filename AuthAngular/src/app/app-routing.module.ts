import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SecureInnerPagesGuard } from './Guards/secure-inner-pages.guard';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { UserComponent } from './Components/user/user.component';
import { OrderListComponent } from './Components/order/order-list/order-list.component';
import { AuthGuard } from './Guards/auth.guard';
import {NewOrdersComponent} from "./Components/new-orders/new-orders.component";

const routes: Routes = [
  {
    path: 'SignIn',
    component: LoginComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'SignUp',
    component: RegisterComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'User',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['User','Admin'],
    },
  },
  {
    path: 'new-orders',
    component: NewOrdersComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   role: ['Admin'],
    // },
  },
  {
    path: 'order-list',
    component: OrderListComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   role: ['User','Admin'],
    // },
  },


  { path: 'Home', component: HomeComponent },
  { path: '', redirectTo: '/Home', pathMatch: 'full' }, // redirect to Home component on root path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
