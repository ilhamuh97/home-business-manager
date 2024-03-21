import { GoogleSpreadsheet } from 'google-spreadsheet';
import { IRawOrder } from '../types/Order.model';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { RawMenu } from '../types/Menu.model';
import { getInvoiceType, getRowsObject, getValue } from './googleSheets';

export async function calculateTotalPrice(
  order: IRawOrder,
  doc: GoogleSpreadsheet | undefined = undefined,
) {
  const invoiceType = getInvoiceType(order.Invoice);
  if (getValue(order['Total Price']).replace(/\D/g, '') !== '') {
    return getNumberOnly(order['Total Price']);
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

export function getPriceWithQuantity(
  price: number | string | undefined,
  quantity: number | string | undefined = '1',
): string {
  if (price === undefined || quantity === undefined) {
    return `Rp${(0).toLocaleString('id-ID')}`;
  }

  const onlyNumberPrice =
    typeof price === 'string' ? price.replace(/\D/g, '') : price;
  const onlyNumberQuantity =
    typeof quantity === 'string' ? quantity.replace(/\D/g, '') : quantity;

  if (onlyNumberPrice || onlyNumberQuantity) {
    const sumPrice = Number(onlyNumberPrice) * Number(onlyNumberQuantity);
    return `Rp${sumPrice.toLocaleString('id-ID')}`;
  }

  return `Rp${(0).toLocaleString('id-ID')}`;
}

export function getPrice(price: number | string | undefined): string {
  if (price === undefined) {
    return `Rp${(0).toLocaleString('id')}`;
  }

  const onlyNumberPrice =
    typeof price === 'string' ? price.replace(/\D/g, '') : price;
  if (onlyNumberPrice) {
    return `Rp${Number(onlyNumberPrice).toLocaleString('id-ID')}`;
  }

  return `Rp${(0).toLocaleString('id-ID')}`;
}
