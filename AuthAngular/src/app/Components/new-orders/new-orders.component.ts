import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../Services/user.service";
import * as JsBarcode from "jsbarcode";
import {NotificationService} from "../../Services/notification.service";
import {WebSocketService} from "../../Services/webSocket.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderService} from "../order/services/order.service";

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css']
})
export class NewOrdersComponent implements OnInit {
  listProducts : any[] = [];
  productId = '230220119012'
  private code: string = '';
  constructor(
    private userService : UserService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef){
    this.getAllProducts();
  }

  ngOnInit() {
    this.orderService.newOrders.subscribe(data => {
      console.log('data', data);
      if (data) {
        this._snackBar.open(
          'Новая заявка',
          '✔',
          {
            panelClass: ['green-snackbar']
          }
        );
        this.listProducts.push(data);
      }
    });
    // JsBarcode('#barcode', this.productId, {
    //   format: 'CODE128', // Specify the barcode format (CODE128, CODE39, etc.)
    //   displayValue: false // Whether to display the product ID beneath the barcode
    // });
  }

  ngAfterViewInit() {
    let data: string = '230220119012';

    JsBarcode('#barcode', data, {
      format: 'code128', // default
      width: 2.3,
      // displayValue: false,
      text: '-' + data + '-',
      background: 'rgba(0,0,0,0.1)',
      font: 'monospace',
      fontOptions: 'bold',
      fontSize: 16,
      lineColor: 'darkblue',
    });
  }

  receiveSocketResponse() {
    // this.websocketService.receiveStatus().subscribe((receivedMessage: any) => {
    //   console.log('11', receivedMessage);
    // });
  }

  getAllProducts(){
    this.orderService.getByStatus(0).subscribe((response : any[])=>{
      this.listProducts = response;
      // this.generateBarcodes();
      // this._snackBar.open()
      this.cd.detectChanges();
      console.log('asd', this.listProducts)
    })
  }

  updateStatus(barcode: string): void {
    this.orderService.updateProductStatus(barcode, 1).subscribe(
      response => {
        this.notificationService.success('Успешно');
        this.listProducts = this.listProducts.filter(item => item.itemCode != barcode);
        console.log('Product status updated successfully:', response);
      },
      error => {
        console.error('Failed to update product status:', error);
      }
    );
  }

}
