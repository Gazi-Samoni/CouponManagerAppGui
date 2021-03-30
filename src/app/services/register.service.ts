import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Customer} from '../dataTypes/customer';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerAPIURL = environment.registerAPIURL;

  constructor(private http: HttpClient) { }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.registerAPIURL}/add`, customer);
  }
}
