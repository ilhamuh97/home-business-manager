import dayjs from 'dayjs';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { Order } from '../types/Order.model';
import { getPrice, getPriceWithQuantity } from './prices';

export function capitalizeFirstLetter(sentence: string) {
  let words: string[] = sentence.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(' ');
}

export async function getReadableRawOrder() {
  try {
    const doc = await initializeGoogleSheets();
    const sheet = await loadSheetByTitle(doc, 'Order', 2);
    const rawRows = sheet.headerValues;

    return rawRows
      .map((rawRow) => {
        return `${rawRow}: `;
      })
      .join('\n');
  } catch (error: any) {
    console.log(error.message);
  }
}

export function createInvoiceForCustomer(order: Order) {
  return `*Invoice nr. ${order.invoice}*

*Name:* ${order.customer?.name}
*Phone Number:* ${order.customer?.phoneNumber}
*Address:* ${order.customer?.address}

*Shipment/Pickup Date:* ${
    order.shipmentDate
      ? dayjs(order.shipmentDate).locale('en').format('DD MMMM YYYY')
      : ''
  }
*Exp Date:* ${
    order.shipmentDate
      ? dayjs(order.shipmentDate)
          .add(7, 'day')
          .locale('en')
          .format('DD MMMM YYYY')
      : ''
  }
*Courier:* ${order.extraInformation?.courier}

*Order:*
${order.menu
  ?.map((m) => {
    return `${m.name} (${m.quantity}) x ${getPrice(m.price)}`;
  })
  .join('\n')}

*Packaging:* ${getPrice(order.payment?.packaging)}
*Shipping Cost:* ${getPrice(order.payment?.shipping)}
*Discount:* ${getPrice(order.payment?.discount)}

*Total Price:* ${getPrice(order.payment?.totalPrice)}

*Notes:*`;
}
