import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Company} from '../dataTypes/company';
import {environment} from '../../environments/environment';
import {Coupon} from '../dataTypes/coupon';
import {ClientService} from './ClientService';

@Injectable({
  providedIn: 'root'
})
export class CompanyService  implements ClientService{
  private companyAPIURL = environment.companyAPIURL;
  public name = 'Company';

  constructor(private http: HttpClient) { }
  public login(email: string, password: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.companyAPIURL}/login/${email}/${password}`, { observe: 'response' });
  }

  public addCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.companyAPIURL}/coupon/add`, coupon);
  }

  public updateCoupon(coupon: Coupon): Observable<Coupon> {
    console.log(coupon);
    return this.http.put<Coupon>(`${this.companyAPIURL}/coupon/update`, coupon);
  }

  public deleteCoupon(couponId: number): Observable<void> {
    return this.http.delete<void>(`${this.companyAPIURL}/coupon/delete/${couponId}`);
  }

  public getCompanyCoupons(): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.companyAPIURL}/coupons`);
  }

  public getCompanyCouponsByCategory(category: string): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.companyAPIURL}/coupons/category/${category}`);
  }

  public getCompanyCouponsByMaxPrice(maxPrice: number): Observable<Array<Coupon>> {
    return this.http.get<Array<Coupon>>(`${this.companyAPIURL}/coupons/price/${maxPrice}`);
  }

  public getCompanyDetails(): Observable<Company> {
    return this.http.get<Company>(`${this.companyAPIURL}/details`);
  }



}
