import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from './Services/auth.service';
import {WebSocketService} from "./Services/webSocket.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderService} from "./Components/order/services/order.service";
import {DataService} from "./Services/data.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogCostComponent} from "./core/modals/dialog-cost/dialog-cost.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    // User Status
    isLoggedIn!: boolean;
    orderNumber: number = 0;
    tenge: any = 0;
    cost_per_unit: any = 0;
    constructor(
      private authService : AuthService,
      private orderService : OrderService,
      private websocketService: WebSocketService,
      public dialog: MatDialog,
      private _snackBar: MatSnackBar){
    }

    ngOnInit(): void {
      this.isLoggedIn = !!this.authService.getToken();
      this.initializeSocketConnection();
      this.initializeCurrency();
      this.initializeCurrencyCost();
    }

    openDialog(): void {
      console.log('22')
      const dialogRef = this.dialog.open(DialogCostComponent, {
        data: {cost: this.cost_per_unit},
      });

      dialogRef.afterClosed().subscribe(result => {
        this.orderService.storeCurrencyCost({value: result}).subscribe(data => {
          this.cost_per_unit = data.value;
        })
      });
    }

  //Method to
  getUserName() {
    return this.authService.getUser();
  }
    //Method to logout
  signOut() {
    this.authService.signOut();
  }

  initializeSocketConnection() {
    this.websocketService.connectSocket();
    this.websocketService.receiveNewOrder().subscribe((newOrder: any) => {
      this._snackBar.open(
        'Новая заявка',
        '✔',
        {
          panelClass: ['green-snackbar']
        }
      );
      this.orderNumber ++;
      this.orderService.newOrders.next(newOrder);
    });
  }

  initializeCurrency() {
    this.orderService.getCurrencyApi().subscribe(data => {
      console.log('data', data);
      this.tenge = data.value;
      this.orderService.setCurrency(data);
    })
  }

  initializeCurrencyCost() {
    this.orderService.getCurrencyCostApi().subscribe(data => {
      this.cost_per_unit = data.value;
      this.orderService.setPerCost(this.cost_per_unit);
    })
  }

  ngOnDestroy() {
    this.disconnectSocket();
  }

  disconnectSocket() {
    this.websocketService.disconnectSocket();
  }


}
