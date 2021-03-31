import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Coupon} from '../dataTypes/coupon';
import {Company} from '../dataTypes/company';
import {CompanyService} from '../services/company.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';
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

  public maxPrice = 0;
  public currentRangePrice = 0;
  public maxPriceInput: HTMLInputElement | null | undefined;
  @ViewChild('radios1') radios1: ElementRef | undefined;
  @ViewChild('radios2') radios2: ElementRef | undefined;
  @ViewChild('radios3') radios3: ElementRef | undefined;
  @ViewChild('radios4') radios4: ElementRef | undefined;

  constructor(private customerService: CustomerService, private app: AppComponent) {
    this.customerCoupons = [];
    this.companyCoupons = [];
    this.customerDetails = null;
    this.purchaseCoupon = null;
    this.ePageIndex = eCustomerIndexPage.showCompaniesCoupons;
  }

  ngOnInit(): void {
    this.getCustomerDetails();
    this.maxPriceInput = document.getElementById('maxPriceInput') as HTMLInputElement;
    this.reset();
  }

  public reset(): void{
    if (this.radios1 !== undefined) {
      this.radios1.nativeElement.checked = false;
    }

    if (this.radios2 !== undefined) {
      this.radios2.nativeElement.checked = false;
    }

    if (this.radios3 !== undefined) {
      this.radios3.nativeElement.checked = false;
    }

    if (this.radios4 !== undefined) {
      this.radios4.nativeElement.checked = false;
    }
    if (this.maxPriceInput != null) {
      this.currentRangePrice = this.maxPrice / 2;
    }
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
  public categoryChanged(category: string): void {
    this.currentCategory = category;
  }

  private getAllCoupons(): void {
    this.customerService.getAllCoupons().subscribe(
      (response: Coupon[]) => {
        this.companyCoupons = response.sort((one, two) => (one.title > two.title ? -1 : 1));
        console.log('getAllCoupons');
        this.getRangeValueAllCompaniesCoupons();
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
      this.getRangeValueAllCompaniesCoupons();
    }
    else if (collection === 'My')
    {
      this.ePageIndex = eCustomerIndexPage.showMyCoupons;
      this.getRangeValueAllCustomersCoupons();
    }

  }

  public applyMaxPriceFilter(): void{
    if (this.currentRangePrice !== undefined) {
      if (this.ePageIndex === eCustomerIndexPage.showCompaniesCoupons) {
        console.log(this.currentRangePrice + 'currentMaxPrice');
        this.customerService.getAllCouponsByMaxPrice(this.currentRangePrice).subscribe(
          (response: Coupon[]) => {
            this.companyCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
          }
        );
      }else{
        this.customerService.getCustomerCouponsByMaxPrice(this.currentRangePrice).subscribe(
          (response: Coupon[]) => {
            this.customerCoupons = response;
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            this.app.handleError(error);
          });
      }
    }
  }

  private getRangeValueAllCompaniesCoupons(): void{
    this.customerService.getAllCoupons().subscribe(
      (response: Coupon[]) => {
        this.companyCoupons = response.sort((one, two) => (one.title > two.title ? -1 : 1));
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
    if (this.companyCoupons !== null && this.companyCoupons.length > 0) {
      const mostExpensiveCoupon = this.companyCoupons.reduce(
        (accumulator, currentValue) => {
          return (accumulator.price > currentValue.price ? accumulator : currentValue);
        });
      this.maxPrice = mostExpensiveCoupon.price + 1;
      this.currentRangePrice = this.maxPrice / 2;
    }
  }
  private getRangeValueAllCustomersCoupons(): void{
    this.customerService.getCustomerCoupons().subscribe(
      (response: Coupon[]) => {
        this.customerCoupons = response;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
    if (this.companyCoupons !== null && this.companyCoupons.length > 0) {
      const mostExpensiveCoupon = this.companyCoupons.reduce(
        (accumulator, currentValue) => {
          return (accumulator.price > currentValue.price ? accumulator : currentValue);
        });
      this.maxPrice = mostExpensiveCoupon.price + 1;
      this.currentRangePrice = this.maxPrice / 2;
    }
  }

  public maxPriceChanged(): void{
    if (this.maxPriceInput != null) {
      this.currentRangePrice = Number(this.maxPriceInput?.value);
    }
  }

}

