import { ICustomer } from "@/models/customer.model";
import { IFeedBack, IOrder } from "../models/order.model";
import dayjs, { OpUnitType } from "dayjs";

export const getFilteredOrder = (
  ordersCurrYear: IOrder[],
  date: dayjs.Dayjs,
  granularity: OpUnitType,
) => {
  return ordersCurrYear.filter((order) =>
    dayjs(order.orderDate).isSame(date, granularity),
  );
};

export const getOrdersNumberOfMonth = (
  ordersCurrYear: IOrder[],
  date: dayjs.Dayjs,
  granularity: OpUnitType,
) => {
  if (ordersCurrYear.length === 0) {
    return 0;
  }

  return getFilteredOrder(ordersCurrYear, date, granularity).reduce((count) => {
    return count + 1;
  }, 0);
};

export const generateCustomerInvoiceSummary = (
  orders: IOrder[],
): ICustomer[] => {
  const filteredInvoices = orders.filter(
    (order) =>
      order.extraInformation.feedback.toLowerCase() !== IFeedBack.CANCELED,
  );

  const customerSummary: any = {};

  filteredInvoices.forEach((order) => {
    const customerPhoneNumber = order.customer.phoneNumber;

    if (!customerSummary[customerPhoneNumber]) {
      customerSummary[customerPhoneNumber] = {
        name: order.customer.name,
        phoneNumber: order.customer.phoneNumber,
        address: order.customer.address,
        joinDate: order.orderDate,
        lastOrder: order.orderDate,
        totalInvoices: 1,
        totalSpend: order.payment.totalPrice,
      };
    } else {
      const lastOrderDate = dayjs(order.orderDate);
      const currentLastOrderDate = dayjs(
        customerSummary[customerPhoneNumber].lastOrder,
      );

      if (lastOrderDate.isAfter(currentLastOrderDate)) {
        customerSummary[customerPhoneNumber].lastOrder =
          lastOrderDate.format("DD MMMM YYYY");
      }

      customerSummary[customerPhoneNumber].totalInvoices += 1;
      customerSummary[customerPhoneNumber].totalSpend +=
        order.payment.totalPrice;
    }
  });

  const summaryArray: ICustomer[] = Object.values(customerSummary);

  console.log(summaryArray);
  return summaryArray;
};
