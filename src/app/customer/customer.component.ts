import {Component, OnInit} from '@angular/core';
import {Coupon} from '../dataTypes/coupon';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../dataTypes/customer';
import {eCustomerIndexPage} from '../models/eCustomerIndexPage';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})


export class CustomerComponent implements OnInit {
  // MyCoupons
  public customerCoupons: Coupon[];
  // AllCoupons
  public companyCoupons: Coupon[];

  public customerDetails: Customer | null;
  public purchaseCoupon: Coupon | null;
  public currentCategory = '';
  public ePageIndex;

  public  maxPriceFilter: number| undefined;


  constructor(private customerService: CustomerService, private app: AppComponent) {
    this.customerCoupons = [];
    this.companyCoupons = [];
    this.customerDetails = null;
    this.purchaseCoupon = null;
    this.ePageIndex = eCustomerIndexPage.showCompaniesCoupons;
  }

  ngOnInit(): void {
    this.getCustomerDetails();
    this.reset();
  }

  public reset(): void{
    this.getAllCoupons();
    this.getCustomerCoupons();
  }

  public isThisPageOnScreen(input: string): boolean {
    return input === this.ePageIndex.toString();
  }

  public applyCategoryFilter(): void{
    if (this.currentCategory !== undefined  && this.currentCategory !== '') {
      console.log(this.currentCategory + ' currentCategory');

      if (this.ePageIndex === eCustomerIndexPage.showCompaniesCoupons ) {
        this.customerService.getAllCouponsByCategory(this.currentCategory).subscribe(
          (response: Coupon[]) => {
            this.companyCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            this.app.handleError(error);
          }
        );
      }
      else {
        this.customerService.getCustomerCouponsByCategory(this.currentCategory).subscribe(
          (response: Coupon[]) => {
            this.customerCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            this.app.handleError(error);
          }
        );
      }
    }
  }
  private getAllCoupons(): void {
    this.customerService.getAllCoupons().subscribe(
      (response: Coupon[]) => {
        this.companyCoupons = response.sort((one, two) => (one.title > two.title ? -1 : 1));
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
  }
  private getCustomerDetails(): void {
    this.customerService.getCustomerDetails().subscribe(
      (response: Customer) => {
        this.customerDetails = response;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
  }

  private getCustomerCoupons(): void {
    this.customerService.getCustomerCoupons().subscribe(
      (response: Coupon[]) => {
        this.customerCoupons = response;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
  }
  public onOpenModalCoupon(coupon: Coupon | null, mode: string): void {
    const customerContainer = document.getElementById('coupon-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#purchaseCouponModal');
    }

    customerContainer?.appendChild(button);
    button.click();
  }
  public onPurchaseCoupon(coupon: Coupon| null): void{
    console.log(coupon);
    const isPurchasedBefore = this.customerCoupons.find(value => value.id === coupon?.id);
    if (!isPurchasedBefore ) {
      if (coupon !== null) {
        this.customerService.purchaseCoupon(coupon).subscribe(
          (response: void) => {
            this.getAllCoupons();
            this.getCustomerCoupons();
          },
          (error: HttpErrorResponse) => {
            this.app.handleError(error);
          }
        );
      }
    }
    else {
      alert('Coupon purchased before');
    }
  }
  public onSwitchData(collection: string): void
  {
    console.log(collection);

    if (collection === 'Companies')
    {
      this.ePageIndex = eCustomerIndexPage.showCompaniesCoupons;
      this.getAllCoupons();
    }
    else if (collection === 'My')
    {
      this.ePageIndex = eCustomerIndexPage.showMyCoupons;
      this.getCustomerCoupons();
    }

  }
  public submitFilter(): void
  {
    this.applyMaxPriceFilter();
    this.applyCategoryFilter();
  }

  public applyMaxPriceFilter(): void{
    if (this.maxPriceFilter !== undefined) {
      if (this.ePageIndex === eCustomerIndexPage.showCompaniesCoupons) {
        this.customerService.getAllCouponsByMaxPrice(this.maxPriceFilter).subscribe(
          (response: Coupon[]) => {
            console.log('i am here 179');
            this.companyCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
          }
        );
      }else{
        this.customerService.getCustomerCouponsByMaxPrice(this.maxPriceFilter).subscribe(
          (response: Coupon[]) => {
            console.log('i am here 189');
            this.customerCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            this.app.handleError(error);
          });
      }
    }
  }

}

