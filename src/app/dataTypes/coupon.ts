
export interface Coupon
{
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  price: number;
  image: string;
  companyID: number;
  category: number;
}
