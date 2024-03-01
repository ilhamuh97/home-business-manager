'use strict';

import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { loadSheetByTitle } from '../middlewares/googleSheets';
import { RawOrder } from '../types/Order.model';

export function getRowsObject<T>(
  rows: GoogleSpreadsheetRow<any>[],
): Partial<T>[] {
  return rows.map((row) => row.toObject());
}

export function getRowsByPropertyName(
  rows: GoogleSpreadsheetRow<any>[],
  propertyName: string,
  searchedValue: string,
): Partial<any>[] {
  return rows.filter((row) => row.get(propertyName) === searchedValue);
}

export function createNewInvoice(
  existingInvoiceNumbers: string[],
  invoiceType: string = 'N',
): string {
  // Define the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed
  const currentYear = currentDate.getFullYear() % 100; // Get the last two digits of the year

  // Filter existing invoice numbers for the current month and year
  const currentMonthYearInvoiceNumbers = existingInvoiceNumbers.filter(
    (invoiceNumber) => {
      const stringWithOnlyNumbers = invoiceNumber.replace(/[^0-9]/g, '');
      const monthPart = parseInt(stringWithOnlyNumbers.slice(0, 2));
      const yearPart = parseInt(stringWithOnlyNumbers.slice(2, 4));
      return monthPart === currentMonth && yearPart === currentYear;
    },
  );

  // Find the highest order number for the current month and year
  let maxOrderNumber = 0;
  currentMonthYearInvoiceNumbers.forEach((invoiceNumber) => {
    const stringWithOnlyNumbers = invoiceNumber.replace(/[^0-9]/g, '');
    const orderPart = parseInt(stringWithOnlyNumbers.slice(4));
    if (orderPart > maxOrderNumber) {
      maxOrderNumber = orderPart;
    }
  });

  // Generate the next invoice number
  const nextOrderNumber = maxOrderNumber + 1;
  const nextInvoiceNumber = `${invoiceType}${currentMonth
    .toString()
    .padStart(2, '0')}${currentYear
    .toString()
    .padStart(2, '0')}${nextOrderNumber.toString().padStart(3, '0')}`;

  return nextInvoiceNumber;
}

export async function getOrderByInvoice(
  doc: GoogleSpreadsheet,
  invoice: string,
) {
  try {
    const sheet = await loadSheetByTitle(doc, 'Order', 2);
    const requestedOrder = getRowsObject<RawOrder>(
      await sheet.getRows<RawOrder>(),
    )?.find((row): boolean => row.Invoice === invoice);
    return requestedOrder;
  } catch (error) {
    return undefined;
  }
}

export function getValue(string: string | undefined): string {
  return string || '';
}

export function getInvoiceType(invoice: string) {
  return invoice.replace(/[0-9]/g, '');
}
