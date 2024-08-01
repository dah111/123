import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import * as JsBarcode from "jsbarcode";
import {BehaviorSubject, map} from "rxjs";
import {OrderService} from "../services/order.service";
import {FormControl, FormGroup} from "@angular/forms";
import {DateFormatPipe} from "../../../shared/pipes/date-format.pipe";

@Component({
  selector: 'app-order-lost',
  templateUrl: './order-lost.component.html',
  styleUrls: ['./order-lost.component.scss'],
})
export class OrderLostComponent implements OnInit {
  private code: string = '';
  displayedColumns: string[] = ['id', 'itemName', 'itemCity', 'username', 'itemWeight', 'costPerUnit', 'itemCode', 'status', 'createDate', 'actions'];
  dataSource: BehaviorSubject<any> = new BehaviorSubject([]);
  listOrder: any[] = [];
  form: FormGroup;
  cities: any[] = [];
  constructor(
    private userService : UserService,
    private orderService : OrderService,
    private cd: ChangeDetectorRef){
    this.form = new FormGroup({
      status: new FormControl(),
      cityId: new FormControl(),
      barcode: new FormControl(),
      itemWeight: new FormControl(),
      itemPrice: new FormControl(),
      phone: new FormControl(),
    });
  }

  ngOnInit() {
    this.getAllOrders();
    this.getAllCities();
  }

  getAllOrders(){
    this.userService.getLost().pipe(map(orders => {
      return orders.map((order: any) => ({
        ...order,
        status: 5
      }));
    })).subscribe((response : any[])=>{
      this.dataSource.next(response);
      this.listOrder = response;
    })
  }

  getAllCities(){
    this.orderService.getCities().subscribe(cities => {
      this.cities = cities;
    })
  }

  search() {
    this.orderService.getOrderByFilter(this.form.getRawValue()).subscribe({
      next: (products) => {
        this.dataSource.next(products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

}
