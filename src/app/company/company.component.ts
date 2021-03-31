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
  public currentCategory = '';

  public  maxPriceFilter: number| undefined;
  constructor(private companyService: CompanyService, private app: AppComponent) {
    this.companyCoupons = [];
    this.editCoupon = null;
    this.deleteCoupon = null;
    this.companyDetails = null;
  }

  ngOnInit(): void {
    this.getCompanyDetails();
    this.getCompanyCoupons();
    this.reset();
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
          this.app.InvalidInput(error);
        }
      );
    }
  }
  public reset(): void{
    this.getCompanyCoupons();
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
  public submitFilter(): void
  {
    this.applyMaxPriceFilter();
    this.applyCategoryFilter();
  }
  public applyMaxPriceFilter(): void{
    if (this.maxPriceFilter !== undefined) {
      console.log(this.maxPriceFilter + 'currentMaxPrice');
      this.companyService.getCompanyCouponsByMaxPrice(this.maxPriceFilter).subscribe(
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

}

