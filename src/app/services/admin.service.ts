import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Company} from '../dataTypes/company';
import {environment} from '../../environments/environment';
import {Customer} from '../dataTypes/customer';
import {ClientService} from './ClientService';


@Injectable({
  providedIn: 'root'
})
export class AdminService implements ClientService{
  private adminAPIURL = environment.adminAPIURL;
  public name = 'Admin';
  public tokenHeader = new HttpHeaders();

  constructor(private http: HttpClient) {
  }
  public login(email: string, password: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.adminAPIURL}/login/${email}/${password}`,  { observe: 'response' });
  }

  public addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.adminAPIURL}/company/add`, company);
  }

  public updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.adminAPIURL}/company/update`, company);
  }

  public deleteCompany(companyID: number): Observable<void> {
    return this.http.delete<void>(`${this.adminAPIURL}/company/delete/${companyID}`);
  }

  public getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.adminAPIURL}/company/getAll`);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.adminAPIURL}/customer/add`, customer);
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.adminAPIURL}/customer/update`, customer);
  }

  public deleteCustomer(customerID: number): Observable<void> {
    return this.http.delete<void>(`${this.adminAPIURL}/customer/delete/${customerID}`);
  }

  public getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.adminAPIURL}/customer/getAll`);
  }

}
