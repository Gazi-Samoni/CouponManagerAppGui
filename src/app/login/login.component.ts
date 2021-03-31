import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AdminService} from '../services/admin.service';
import {CompanyService} from '../services/company.service';
import {CustomerService} from '../services/customer.service';
import {Company} from '../dataTypes/company';
import {HttpErrorResponse} from '@angular/common/http';
import {ClientService} from '../services/ClientService';
import {AppComponent} from '../app.component';
import {Customer} from '../dataTypes/customer';
import {RegisterService} from '../services/register.service';

enum ClientType
{
  Administrator,
  Company,
  Customer
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public currentClientType = ClientType.Customer;
  public services: ClientService[] ;
  public loginForm = true;
  public customerSignUP = true;
  constructor(private adminService: AdminService,
              private companyService: CompanyService,
              private customerService: CustomerService,
              private registerService: RegisterService,
              private app: AppComponent) {
    this.services = [adminService, companyService, customerService];
  }

  ngOnInit(): void {
  }
  public login(loginForm: NgForm): void
  {
    const formValue = loginForm.value;
    const email = formValue.email;
    const password = formValue.password;
    const loginType = Number(formValue.loginType);
    this.loginWithTheLoginType(email, password, loginType);
  }
  private loginWithTheLoginType(email: string, password: string, loginType: number): void {
    console.log(email);
    const service = this.services[loginType];
    service?.login(email, password).subscribe(
      response => {
        if (response.body ){
          this.app.onSuccessfulLogin(service.name);
        }
        else {
          alert('Password or Email wrong!');
        }
      });
  }

  public onSwitchForm(): void {
    this.loginForm = !this.loginForm;
  }
  public onSwitchType(type: string): void {
    console.log(type);
    if (type === 'Companies')
    {
      this.customerSignUP = true;
    }
    else if (type === 'Customers')
    {
      this.customerSignUP = false;
    }
  }
}

