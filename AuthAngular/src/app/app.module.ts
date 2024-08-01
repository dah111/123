import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { authInterceptorProviders } from './Interceptor/auth.interceptor';
import { DataService } from './Services/data.service';
import { AddressService } from './Services/address.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { UserComponent } from './Components/user/user.component';
import { AuthService } from './Services/auth.service';
import { HomeComponent } from './Components/home/home.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import {NewOrdersComponent} from "./Components/new-orders/new-orders.component";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {OrderModule} from "./Components/order/order.module";
import {DialogCostComponent} from "./core/modals/dialog-cost/dialog-cost.component";

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

export function tokenGetter() {
  return sessionStorage.getItem("TOKEN_KEY");
}

// const config: SocketIoConfig = {
//   url: 'http://localhost:4000', // socket server url;
//   options: {
//     transports: ['websocket']
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    NewOrdersComponent,
    DialogCostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: [],
      },
    }),
    OrderModule,
    // SocketIoModule.forRoot(config),
    // SocketIoModule.forRoot(config),
  ],
  providers: [
    authInterceptorProviders,
    DataService,
    AddressService,
    AuthService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
      duration: 3500,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    }},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
