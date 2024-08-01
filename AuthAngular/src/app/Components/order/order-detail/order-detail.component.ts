import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../services/order.service";
import * as JsBarcode from "jsbarcode";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderId: number;
  form: FormGroup;
  cities: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private snackBar: MatSnackBar
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
    this.form.get('costPerUnit')?.disable();
  }
  perCost = 1;

  ngOnInit() {
    if (this.orderId) {
      this.onLoadData();
    }
    this.orderService.getPerCost().subscribe(data => {
      this.perCost = data;
    })

    this.form.get('itemWeight')?.valueChanges.subscribe(value => {
      this.form.patchValue({costPerUnit: value * this.perCost})
    });
    this.getAllCities();
  }

  onLoadData() {
    this.orderService.getOrder(this.orderId).subscribe((data: any) => {
      this.form.patchValue({
        ...data,
        phone: data.client?.username,
        city: data.city.id,
      });
      console.log('form', this.form.value)
      JsBarcode('#barcode', data.itemCode, {
        format: 'CODE128',
        width: 5,
        height: 230,
      });
      this.form.get('itemCode')?.disable();
    },
    error => {
      this.snackBar.open('Нету такого id в заказе', '❌');
    });
  }

  getAllCities(){
    this.orderService.getCities().subscribe(cities => {
      this.cities = cities;
    })
  }


  onSubmit() {
    if (this.orderId) {
      this.orderService.updateProduct(this.orderId, this.form.getRawValue()).subscribe({
        next: (data: any) => {
          this.snackBar.open(
            'Успешно обнавлено',
            '✔',
            {
              panelClass: ['green-snackbar']
            }
          );
        },
        error: (err: any) => {
          this.snackBar.open(err.error, '❌');
        },
      })
    } else {
      this.orderService.createProduct(this.form.getRawValue()).subscribe({
        next: (data: any) => {
          this.snackBar.open(
            'Успешно создана новая заявка',
            '✔',
            {
              panelClass: ['green-snackbar']
            }
          );
        },
        error: (err: any) => {
          this.snackBar.open(err.error, '❌');
        },
      })
    }
  }

  onCancel() {
    this.router.navigate(['/order'])
  }




}
