import {Component, OnInit} from '@angular/core';
import {Company} from './dataTypes/company';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public showLogin = true;
  public showAdmin = false;
  public showCompany = false;
  public showCustomer = false;
  private  timeOut = 408;

  ngOnInit(): void {
  }

  public onSuccessfulLogin(componentName: string): void
  {
    this.showLogin = !this.showLogin;
    if (componentName === 'Admin') {
      this.showAdmin = !this.showAdmin;
    }
    else if (componentName === 'Company')
    {
      this.showCompany = !this.showCompany;
    }
    else if (componentName === 'Customer')
    {
      this.showCustomer = !this.showCustomer;
    }
  }
  public onLogOut(): void
  {
    this.showLogin = true;

    this.showAdmin = this.showCompany = this.showCustomer = false;
  }

  public handleError(error: HttpErrorResponse): void {
    const errorStatus =  error.status;
    if (errorStatus === this.timeOut)
    {
      alert('Logging out: 30 min without action');
      this.onLogOut();
    }
    else
    {
      alert(error.error.message);
    }
  }
}
