import { Menu, RawMenu } from '../types/Menu.model';
import { RawOrder, Order } from '../types/Order.model';

export function menusForOrder(
  order: Partial<RawOrder>,
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

export function rawOrderToOrder(
  orderRows: Partial<RawOrder>[],
  menuRows: Partial<RawMenu>[],
): Order[] {
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
      FeedBack: feedback = '',
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
        discount: parseFloat(orderDiscount) || 0,
        packaging: parseFloat(orderPackaging) || 0,
        shipping: parseInt(orderShipping) || 0,
        totalPrice: parseInt(orderPrice) || 0,
        paymentMethod,
      },
      extraInformation: {
        courier: orderDiscount,
        information: extraInformation,
        feedBack: feedback,
      },
    };
  });
}
