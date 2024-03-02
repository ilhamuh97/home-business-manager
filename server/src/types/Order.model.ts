'use strict';

import { Menu } from './Menu.model';

export interface RawOrder {
  Nr: string;
  Discount: string;
  Shipping: string;
  'Total Price': string;
  Packaging: string;
  Invoice: string;
  Name: string;
  'Phone Number': string;
  Address: string;
  'Order Date': string;
  'Shipment Date': string;
  'Payment Method': string;
  Courier: string;
  Information: string;
  FeedBack: string;
  [menu: string]: string;
}

export interface Order {
  nr?: number;
  invoice?: string;
  orderDate?: string;
  shipmentDate?: string;
  customer?: {
    name?: string;
    phoneNumber?: string;
    address?: string;
  };
  menu?: Menu[];
  payment?: {
    discount?: number;
    packaging?: number;
    shipping?: number;
    totalPrice?: number;
    paymentMethod?: string;
  };
  extraInformation?: {
    courier?: string;
    feedback?: string;
    information?: string;
  };
}
