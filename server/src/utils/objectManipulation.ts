import { Customer, RawCustomer } from '../types/Customer.model';
import { Menu, RawMenu } from '../types/Menu.model';
import { IRawOrder, IOrder } from '../types/Order.model';
import { getNumberOnly } from './prices';

export function menusForOrder(
  order: Partial<IRawOrder>,
  menuRows: Partial<RawMenu>[],
): Menu[] {
  return menuRows
    .filter((menu) => {
      const menuRowKey: string = menu.Key || '';
      return order[menuRowKey] !== '0' && order[menuRowKey];
    })
    .map((menu) => {
      const {
        Key: menuKey = '',
        Name: menuName = '',
        Category: menuCategory = '',
        'Normal Price': menuNormalPrice = '',
        'Cafe Price': menuCafePrice = '',
      } = menu;

      const orderInvoice = order.Invoice || '';
      const isNormalInvoice = orderInvoice.replace(/\d+/g, '') === 'N';
      const quantity = order[menuKey] || '0';

      return {
        name: menuName,
        key: menuKey,
        category: menuCategory,
        quantity: parseInt(quantity),
        price:
          parseFloat(isNormalInvoice ? menuNormalPrice : menuCafePrice) || 0,
      } as Menu;
    });
}

export function rawCustomersToCustomer(
  rawCustomers: Partial<RawCustomer>[],
): Customer[] {
  return rawCustomers.map((rawCustomer: RawCustomer) => {
    const {
      Name: name = '',
      Address: address = '',
      'Phone Number': phoneNumber = '',
      'Join Date': joinDate = '',
      'Last Order': lastOrder = '',
      'Total Invoices': totalInvoices = '',
    } = rawCustomer;

    return {
      name: name,
      phoneNumber,
      address,
      joinDate,
      lastOrder,
      totalInvoices: parseInt(totalInvoices) || 0,
    };
  });
}

export function rawMenuToMenu(rawMenu: Partial<RawMenu>[]): Menu[] {
  return rawMenu.map((menu: Partial<RawMenu>) => {
    const {
      Key: menuKey = '',
      Name: menuName = '',
      Category: menuCategory = '',
      'Normal Price': menuNormalPrice = '',
      'Cafe Price': menuCafePrice = '',
    } = menu;

    return {
      name: menuName,
      key: menuKey,
      category: menuCategory,
      normalPrice: parseFloat(menuNormalPrice) || 0,
      cafePrice: parseFloat(menuCafePrice) || 0,
    } as Menu;
  });
}

export function rawOrderToOrder(
  orderRows: Partial<IRawOrder>[],
  menuRows: Partial<RawMenu>[],
): IOrder[] {
  return orderRows.map((order) => {
    const menus = menusForOrder(order, menuRows);
    const {
      Nr: orderNumber = '',
      Discount: orderDiscount = '',
      Shipping: orderShipping = '',
      'Total Price': orderPrice = '',
      Packaging: orderPackaging = '',
      Invoice: invoice = '',
      Name: customerName = '',
      'Phone Number': phoneNumber = '',
      Address: address = '',
      'Order Date': orderDate = '',
      'Shipment Date': shipmentDate = '',
      'Payment Method': paymentMethod = '',
      Information: extraInformation = '',
      Feedback: feedback = '',
      Courier: courier = '',
    } = order;

    return {
      nr: parseInt(orderNumber) || 0,
      invoice,
      orderDate,
      shipmentDate,
      customer: {
        name: customerName,
        phoneNumber,
        address,
      },
      menu: menus,
      payment: {
        discount: getNumberOnly(orderDiscount) || 0,
        packaging: getNumberOnly(orderPackaging) || 0,
        shipping: getNumberOnly(orderShipping) || 0,
        totalPrice: getNumberOnly(orderPrice) || 0,
        paymentMethod,
      },
      extraInformation: {
        courier: courier,
        information: extraInformation,
        feedback,
      },
    };
  });
}

export function removeEmptyValues(obj: any) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
}
