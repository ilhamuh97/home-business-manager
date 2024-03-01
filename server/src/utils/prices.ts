import { GoogleSpreadsheet } from 'google-spreadsheet';
import { RawOrder } from '../types/Order.model';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { RawMenu } from '../types/Menu.model';
import { getInvoiceType, getRowsObject, getValue } from './googleSheets';

export async function calculateTotalPrice(
  order: RawOrder,
  doc: GoogleSpreadsheet | undefined = undefined,
) {
  const invoiceType = getInvoiceType(order.Invoice);
  if (getValue(order['Total Price']) !== '') {
    return (
      getNumberOnly(order['Total Price']) -
      getNumberOnly(order.Discount) +
      getNumberOnly(order.Shipping) +
      getNumberOnly(order.Packaging)
    );
  }
  try {
    if (doc === undefined) {
      doc = await initializeGoogleSheets();
    }
    const sheet = await loadSheetByTitle(doc, 'Menu', 1);
    const menu = getRowsObject<RawMenu>(await sheet.getRows<RawMenu>());

    let totalPrice = 0;
    Object.keys(order).forEach((orderKey) => {
      const foundMenu = menu.find((m) => m.Key === orderKey);
      if (foundMenu) {
        const menuPrice: number =
          invoiceType === 'N'
            ? getNumberOnly(foundMenu['Normal Price'])
            : getNumberOnly(foundMenu['Cafe Price']);

        totalPrice += getNumberOnly(order[orderKey]) * menuPrice;
      }
    });
    return (
      totalPrice -
      getNumberOnly(order.Discount) +
      getNumberOnly(order.Shipping) +
      getNumberOnly(order.Packaging)
    );
  } catch (error) {
    return 0;
  }
}

export function getNumberOnly(price: string | undefined): number {
  if (price === undefined) {
    return 0;
  }

  const onlyNumber = price.replace(/\D/g, '');
  if (onlyNumber) {
    return Number(onlyNumber);
  }

  return 0;
}
