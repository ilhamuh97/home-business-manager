import dayjs from 'dayjs';
import { formatDate } from '../../../utils/date';
import { IRawOrder } from '../../../types/Order.model';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { createNewInvoice, getValue } from '../../../utils/googleSheets';
import { calculateTotalPrice } from '../../../utils/prices';

export class Order {
  private orderData: IRawOrder;

  constructor(orderData: IRawOrder) {
    this.orderData = orderData;
  }

  async validate(
    orders: Partial<IRawOrder>[],
    doc: GoogleSpreadsheet,
    sheet: GoogleSpreadsheetWorksheet,
  ): Promise<string | null> {
    // Check dates
    this.orderData['Order Date'] = this.orderData['Order Date']
      ? formatDate(this.orderData['Order Date'])
      : dayjs().format('DD MMMM YYYY');

    this.orderData['Shipment Date'] = this.orderData['Shipment Date']
      ? formatDate(this.orderData['Shipment Date'])
      : '';

    // Check keys
    const sentKeys = Object.keys(this.orderData);
    const missingKeys = sentKeys.filter(
      (key) => !sheet.headerValues.includes(key),
    );

    if (missingKeys.length > 0) {
      return `Error: Missing keys in sent data: ${missingKeys.join(', ')}`;
    }

    // check required values
    if (
      getValue(this.orderData['Phone Number']) === '' ||
      getValue(this.orderData.Name) === ''
    ) {
      return 'Name and Phone Number cannot be empty!';
    }

    // check invoice numbers
    const existingInvoiceNumbers = orders.map((order) =>
      getValue(order['Invoice']),
    );
    if (this.orderData.Invoice === undefined || this.orderData.Invoice === '') {
      const newInvoice = createNewInvoice(existingInvoiceNumbers);
      this.orderData.Invoice = newInvoice;
    }

    const containsOnlyNonNumeric = /^[^0-9]+$/.test(this.orderData.Invoice);
    if (containsOnlyNonNumeric) {
      const newInvoice = createNewInvoice(
        existingInvoiceNumbers,
        this.orderData.Invoice,
      );
      this.orderData.Invoice = newInvoice;
    }

    const existingOrder = orders.find(
      (row) => row['Invoice'] === this.orderData.Invoice,
    );
    if (existingOrder !== undefined) {
      return 'The invoice already exists!';
    }

    const totalPrice = await calculateTotalPrice(this.orderData, doc);
    this.orderData['Total Price'] = String(totalPrice);

    return null;
  }

  getRawOrder(): IRawOrder {
    return this.orderData;
  }
}
