import { ICustomer } from "./customer.model";
import { IMenu } from "./menu.model";

export interface IOrder {
  nr: number;
  invoice: string;
  orderDate: string;
  shipmentDate: string;
  customer: ICustomer;
  menu: IMenu[];
  payment: IPayment;
  extraInformation: IExtraInfromation;
}

interface IPayment {
  discount: number;
  packaging: number;
  shipping: number;
  totalPrice: number;
  paymentMethod: string;
}

interface IExtraInfromation {
  courier: string;
  information: string;
  feedback: IFeedBack;
}

export enum IFeedBack {
  DONE = "done",
  PAID = "paid",
  DELIVERED = "delivered",
  CANCELED = "canceled",
  NOSTATUS = "",
}
