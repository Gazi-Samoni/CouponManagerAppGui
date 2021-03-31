import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Coupon} from '../dataTypes/coupon';
import {Customer} from '../dataTypes/customer';
import {environment} from '../../environments/environment';
import {ClientService} from './ClientService';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements ClientService{
  private customerAPIURL = environment.customerAPIURL;
  public name = 'Customer';
  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.customerAPIURL}/login/${email}/${password}`, { observe: 'response' });
  }

  public purchaseCoupon(couponId: number): Observable<void> {
    return this.http.post<void>(`${this.customerAPIURL}/add/`, couponId);
  }

  public getCustomerCoupons(): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/coupons`);
  }

  public getCustomerCouponsByCategory(category: string): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/coupons/category/${category}`);
  }

  public getCustomerCouponsByMaxPrice(maxPrice: number): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/coupons/price/${maxPrice}`);
  }

  public getCustomerDetails(): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerAPIURL}/details`);
  }

  public getAllCoupons(): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/AllCompanies`);
  }

  public getAllCouponsByCategory(category: string): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/AllCompanies/${category}`);
  }

  public getAllCouponsByMaxPrice(maxPrice: number): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.customerAPIURL}/AllCoupons/price/${maxPrice}`);
  }
}
