export interface RawCustomer {
  Name?: string;
  'Phone Number'?: string;
  Address?: string;
  'Join Date'?: string;
  'Last Order'?: string;
  'Total Invoices'?: string;
}

export interface Customer {
  name?: string;
  phoneNumber?: string;
  address?: string;
  joinDate?: string;
  lastOrder?: string;
  totalInvoices?: number;
}
