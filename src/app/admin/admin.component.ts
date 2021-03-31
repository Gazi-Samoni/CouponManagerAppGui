import { Component, OnInit } from '@angular/core';
import {Company} from '../dataTypes/company';
import {AdminService} from '../services/admin.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Customer} from '../dataTypes/customer';
import {CompanyService} from '../services/company.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public companies: Company[] | undefined;
  public editCompany: Company | null | undefined;
  public deleteCompany: Company | null | undefined;
  public customers: Customer[] | undefined;
  public editCustomer: Customer | null | undefined;
  public deleteCustomer: Customer | null | undefined;
  public showCompanies = true;

  constructor(private adminService: AdminService, private app: AppComponent) {
    this.companies = [];
  }

  ngOnInit(): void
  {
    this.getCompanies();
    this.getCustomers();
  }

  public getCompanies(): void {
    this.adminService.getAllCompanies().subscribe(
      (response: Company[]) => {
        this.companies = response;
        // this.companies.forEach(value => value.imageUrl = 'assets/images/' + value.name + '.png');
      },
      (error: HttpErrorResponse) => {
      }
    );
  }
  public onOpenModalCompanies(company: Company | null, mode: string): void {
    const companyContainer = document.getElementById('company-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCompanyModal');
    }
    else if (mode === 'edit') {
      this.editCompany = company;
      button.setAttribute('data-target', '#updateCompanyModal');
    }
    else if (mode === 'delete') {
      this.deleteCompany = company;
      button.setAttribute('data-target', '#deleteCompanyModal');
    }

    companyContainer?.appendChild(button);
    button.click();
  }
  public onAddCompany(addForm: NgForm): void{
    document.getElementById('add-company-form')?.click();
    console.log(addForm.value);
    this.adminService.addCompany(addForm.value).subscribe(
      (response: Company) => {
        console.log(response);
        this.getCompanies();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        addForm.reset();
      }
    );
  }
  public onUpdateCompany(company: Company): void{
    console.log(company + 'onUpdateCompany');
    this.adminService.updateCompany(company).subscribe(
      (response: Company) => {
        console.log(response);
        this.getCompanies();
      },
      (error: HttpErrorResponse) => {
      }
    );
  }
  public onDeleteCompany(companyId: number| undefined): void{
    console.log(companyId);
    if (companyId !== undefined)
    {
      this.adminService.deleteCompany(companyId).subscribe(
        (response: void) => {
          console.log(response);
          this.getCompanies();
        },
        (error: HttpErrorResponse) => {
        }
      );
    }
  }


  // ---------------- customers---------------

  public getCustomers(): void {
    this.adminService.getAllCustomers().subscribe(
      (response: Customer[]) => {
        this.customers = response;
        // this.customers.forEach(value => value.imageUrl = 'assets/images/' + value.name + '.png');
      },
      (error: HttpErrorResponse) => {
      }
    );
  }
  public onOpenModalCustomers(customer: Customer | null, mode: string): void {
    const customerContainer = document.getElementById('customer-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCustomerModal');
    }
    else if (mode === 'edit') {
      this.editCustomer = customer;
      button.setAttribute('data-target', '#updateCustomerModal');
    }
    else if (mode === 'delete') {
      this.deleteCustomer = customer;
      button.setAttribute('data-target', '#deleteCustomerModal');
    }

    customerContainer?.appendChild(button);
    button.click();
  }
  public onAddCustomer(addForm: NgForm): void{
    document.getElementById('add-customer-form')?.click();
    console.log(addForm.value);
    this.adminService.addCustomer(addForm.value).subscribe(
      (response: Customer) => {
        console.log(response);
        this.getCustomers();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        addForm.reset();
      }
    );
  }
  public onUpdateCustomer(customer: Customer): void{
    if (this.editCustomer !== undefined && this.editCustomer !== null) {
      customer.id = this.editCustomer.id;
      this.adminService.updateCustomer(customer).subscribe(
        (response: Customer) => {
          console.log(response);
          this.getCustomers();
        },
        (error: HttpErrorResponse) => {
        }
      );
    }
  }
  public onDeleteCustomer(customerId: number| undefined): void{
    console.log(customerId);
    if (customerId !== undefined)
    {
      this.adminService.deleteCustomer(customerId).subscribe(
        (response: void) => {
          console.log(response);
          this.getCustomers();
        },
        (error: HttpErrorResponse) => {
        }
      );
    }
  }

  public onSwitchData(collection: string): void
  {
    console.log(collection);
    if (collection === 'Companies')
    {
      this.showCompanies = true;
    }
    else if (collection === 'Customers')
    {
      this.showCompanies = false;
    }

  }
}

