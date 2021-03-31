import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Coupon} from '../dataTypes/coupon';
import {CompanyService} from '../services/company.service';
import {Company} from '../dataTypes/company';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {AppComponent} from '../app.component';



enum Category {
  Food,
  Electricity,
  Restaurant,
  Vacation
}


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  public companyCoupons: Coupon[];
  public editCoupon: Coupon | null;
  public deleteCoupon: Coupon | null;
  public companyDetails: Company | null;
  @ViewChild('radios1') radios1: ElementRef | undefined;
  @ViewChild('radios2') radios2: ElementRef | undefined;
  @ViewChild('radios3') radios3: ElementRef | undefined;
  @ViewChild('radios4') radios4: ElementRef | undefined;
  public maxPrice = 0;
  public currentRangePrice = 0;
  public maxPriceInput: HTMLInputElement | null | undefined;
  public currentCategory = '';
  constructor(private companyService: CompanyService, private app: AppComponent) {
    this.companyCoupons = [];
    this.editCoupon = null;
    this.deleteCoupon = null;
    this.companyDetails = null;
  }

  ngOnInit(): void {
    this.getCompanyDetails();
    this.getCompanyCoupons();
    this.maxPriceInput = document.getElementById('maxPriceInput') as HTMLInputElement;
    this.reset();
  }
  private getRangeValue(): void {
    if (this.companyCoupons !== null && this.companyCoupons.length > 0) {
      const mostExpensiveCoupon = this.companyCoupons.reduce(
        (accumulator, currentValue) => {
          return (accumulator.price > currentValue.price ? accumulator : currentValue);
        });
      this.maxPrice = mostExpensiveCoupon.price + 1;
      this.currentRangePrice = this.maxPrice / 2;
    }
  }

  private getCompanyDetails(): void {
    this.companyService.getCompanyDetails().subscribe(
      (response) => {
        this.companyDetails = (response as Company);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
  }
  private getCompanyCoupons(): void {
    this.companyService.getCompanyCoupons().subscribe(
      (response: Coupon[]) => {
        this.companyCoupons = response;
        console.log('cateeee' + response[0].category);
        this.getRangeValue();
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
      }
    );
  }

  public onOpenModalCompanie(coupon: Coupon | null, mode: string): void {
    const couponContainer = document.getElementById('coupon-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCouponModal');
    }
    else if (mode === 'edit') {
      this.editCoupon = coupon;
      button.setAttribute('data-target', '#updateCouponModal');
    }
    else if (mode === 'delete') {
      this.deleteCoupon = coupon;
      button.setAttribute('data-target', '#deleteCouponModal');
    }

    couponContainer?.appendChild(button);
    button.click();
  }
  public onAddCoupon(addForm: NgForm): void{
    document.getElementById('add-coupon-form')?.click();
    // const category = addForm.value.
    const coupon: Coupon = addForm.value;
    console.log('onAddCoupon');
    console.log(coupon);
    coupon.companyID = (this.companyDetails?.id as number);

    this.companyService.addCoupon(coupon).subscribe(
      (response: Coupon) => {
        console.log(response);
        this.getCompanyCoupons();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        this.app.handleError(error);
        addForm.reset();
      }
    );
  }

  public onOpenModalCoupon(coupon: Coupon | null, mode: string): void {
    const companyContainer = document.getElementById('coupon-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCouponModal');
    }
    else if (mode === 'edit') {
      this.editCoupon = coupon;
      button.setAttribute('data-target', '#updateCouponModal');
    }
    else if (mode === 'delete') {
      this.deleteCoupon = coupon;
      button.setAttribute('data-target', '#deleteCouponModal');
    }

    companyContainer?.appendChild(button);
    button.click();
  }
  public onUpdateCoupon(coupon: Coupon): void {
    console.log(coupon);
    if (this.editCoupon !== undefined && this.editCoupon !== null && this.companyDetails != null) {
      coupon.companyID = this.companyDetails.id;
      coupon.id = this.editCoupon.id;
      this.companyService.updateCoupon(coupon).subscribe(
        (response: Coupon) => {
          console.log(response);
          this.getCompanyCoupons();
        },
        (error: HttpErrorResponse) => {
          this.app.handleError(error);
        }
      );
    }
  }
  public onDeleteCoupon(couponId: number| undefined): void{
    console.log(couponId);
    if (couponId !== undefined)
    {
      this.companyService.deleteCoupon(couponId).subscribe(
        (response: void) => {
          console.log(response);
          this.getCompanyCoupons();
        },
        (error: HttpErrorResponse) => {
          this.app.handleError(error);
        }
      );
    }
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
    this.getCompanyCoupons();
  }
  public categoryChanged(category: string): void {
    this.currentCategory = category;
  }
  public applyCategoryFilter(): void{
    if (this.currentCategory !== undefined && this.currentCategory !== '') {
      console.log(this.currentCategory + 'currentCategory');
      this.companyService.getCompanyCouponsByCategory(this.currentCategory).subscribe(
        (response: Coupon[]) => {
          this.companyCoupons = response;
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          this.app.handleError(error);
        }
      );
    }
  }

  public applyMaxPriceFilter(): void{
    if (this.currentRangePrice !== undefined) {
      console.log(this.currentRangePrice + 'currentMaxPrice');
      this.companyService.getCompanyCouponsByMaxPrice(this.currentRangePrice).subscribe(
        (response: Coupon[]) => {
          this.companyCoupons = response;
          // this.getRangeValue();
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          this.app.handleError(error);
        }
      );
    }
  }



  public maxPriceChanged(): void{
    if (this.maxPriceInput != null) {
      this.currentRangePrice = Number(this.maxPriceInput?.value);
    }
  }
}

