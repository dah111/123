import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

const  APIUrlUser ="http://localhost:4000/api/users";
const  APIUrlAuth ="http://localhost:4000/api/users/login";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public newOrders: Subject<any> = new Subject<any>();
  private currency: Subject<any> = new Subject<any>();
  private perCost: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient){
  }

  getOrder(id: number) {
    return this.http.get(`http://localhost:4000/api/products/${id}`);
  }

  getCities(): Observable<any> {
    return this.http.get('http://localhost:4000/api/cities');
  }

  getByStatus(statusId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:4000/api/products/status/${statusId}`);
  }

  updateProductStatus(itemCode: string, status: number): Observable<any> {
    const statusData = { status }; // Prepare the data to be sent in the request body
    return this.http.patch<any>(`http://localhost:4000/api/products/status/${itemCode}`, statusData);
  }

  updateProduct(id: number, body: any): Observable<any> {
    return this.http.put<any>(`http://localhost:4000/api/products/${id}`, body);
  }

  createProduct(body: any) {
    return this.http.post<any>(`http://localhost:4000/api/products`, body);
  }

  getOrderByFilter(filter: any) {
    let params = new HttpParams();
    Object.keys(filter).forEach(key => {
      if (filter[key] !== null && filter[key] !== undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get<any>(`http://localhost:4000/api/products/filter`, { params });
  }

  getCurrencyApi() {
    return this.http.get<any>(`http://localhost:4000/currency`);
  }

  getCurrencyCostApi() {
    return this.http.get<any>(`http://localhost:4000/currency/cost`);
  }

  storeCurrencyCost(data: any) {
    return this.http.post<any>(`http://localhost:4000/currency/2`, data);
  }

  setCurrency(value: any) {
    this.currency.next(value);
  }

  setPerCost(value: any) {
    this.perCost.next(value);
  }

  getCurrency() {
    return this.currency;
  }

  getPerCost() {
    return this.perCost;
  }


}
