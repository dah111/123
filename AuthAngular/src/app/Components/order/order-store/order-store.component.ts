import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as JsBarcode from "jsbarcode";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-order-store',
  templateUrl: './order-store.component.html',
  styleUrls: ['./order-store.component.scss']
})
export class OrderStoreComponent implements OnInit {
  orderId: number;
  form: FormGroup;
  filterForm: FormGroup;
  cities: any[] = [];
  code: string = '';
  displayedColumns: string[] = ['id', 'itemName', 'itemCity', 'itemWeight', 'itemCode', 'status', 'actions'];
  dataSource: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
  ) {
    this.orderId = Number(this.route.snapshot.params['id']);
    this.form = new FormGroup({
      itemName: new FormControl(),
      city: new FormControl(),
      phone: new FormControl(),
      itemCode: new FormControl(),
      itemWeight: new FormControl(),
      costPerUnit: new FormControl(),
      status: new FormControl(),
      itemDescription: new FormControl(),
      createDate: new FormControl(),
    });
    this.filterForm = new FormGroup({
      status: new FormControl(),
      city: new FormControl(),
      barcode: new FormControl(),
      itemWeight: new FormControl(),
      itemPrice: new FormControl(),
      phone: new FormControl(),
    });
    this.form.disable();
  }

  ngOnInit() {
    // if (this.orderId) {
    //   this.onLoadData();
    // }
    this.getAllOrders();
    this.getAllCities();
    this.form.get('itemWeight')?.valueChanges.subscribe(value => {
      this.form.patchValue({itemPrice: value * 400})
    });
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('asdas', this.code);
      this.updateStatus(this.code);
      this.code = '';
      // The QR/Bar code is ready here
      // Do something here with the scanned code
    } else {
      this.code += event.key;
    }
  }

  updateStatus(barcode: string): void {
    this.orderService.updateProductStatus(barcode, 2).subscribe({
      next: response => {
        console.log('response', response);
        this.onPullForm(response);
        // this.dataSource.next(response);
        this.getAllOrders();
        this.snackBar.open(
          'Успешно прошла приемка',
          '✔',
          {
            panelClass: ['green-snackbar']
          }
        );
      },
      error: error => {
        console.log(error)
        this.snackBar.open(
          `Не прошла приемка. ${error.error}`,
          '❌',
          {
            panelClass: ['red-snackbar']
          }
        );
        console.error('Failed to update product status:', error);
      }
    })
  }


  onLoadData() {
    this.orderService.getOrder(this.orderId).subscribe((data: any) => {
      console.log('data', data);
      this.onPullForm(data);
    });
  }

  onPullForm(data: any) {
    this.form.patchValue({
      ...data,
      city: data.city.name,
    });
    console.log('asdas', this.form.value)
    JsBarcode('#barcode', data.itemCode, {
      format: 'CODE128',
      width: 5,
      height: 230,
    });
  }


  search() {

  }

  getAllOrders(){
    this.orderService.getByStatus(2).subscribe((response : any[])=>{
      this.dataSource.next(response);
    })
  }

  getAllCities(){
    this.orderService.getCities().subscribe(cities => {
      this.cities = cities;
    })
  }


}
