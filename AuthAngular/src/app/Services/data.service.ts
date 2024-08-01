import { HttpClient } from '@angular/common/http';
import { Type } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currency: Subject<any> = new Subject<any>();

   // Inject ApiUrl in constructor to Get it form ather Service
   constructor(@Inject(String) private APIUrl: string,private http: HttpClient) { }


  setCurrency(value: any) {
     this.currency.next(value);
  }

  getCurrency(value: any) {
    return this.currency;
  }


  getCurrencyApi() {
    return this.http.get<any>(`http://localhost:4000/api/products/currency`);
  }

  // Get Method
  getAll(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/api/products');
  }

  getLost(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/api/products/one-month-ago');
  }

  getByStatus(statusId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:4000/api/products/status/${statusId}`);
  }

  // Get with id
  get(id: any): Observable<any> {
    return this.http.get(`${this.APIUrl}/${id}`);
  }

  patchStatus(baroce: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/products`);
  }

  updateProductStatus(itemCode: string, status: number): Observable<any> {
    const statusData = { status }; // Prepare the data to be sent in the request body
    return this.http.patch<any>(`http://localhost:4000/api/products/status/${itemCode}`, statusData);
  }

  // Update Method
  Update(data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}`, data);
  }
  // Create Method
  Create(data: any): Observable<any> {
    return this.http.post('http://localhost:4000/api/auth/signUp', data);
  }
  // Delete Method
  Delete(id: any): Observable<any> {
    return this.http.delete(`${this.APIUrl}/${id}`);
  }
}
