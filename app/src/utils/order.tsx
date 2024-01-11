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
    (order) => order.extraInformation.feedback !== IFeedBack.CANCELED,
  );

  const customerSummary: any = {};

  filteredInvoices.forEach((order) => {
    const customerName = order.customer.name;

    if (!customerSummary[customerName]) {
      customerSummary[customerName] = {
        name: customerName,
        phoneNumber: order.customer.phoneNumber,
        address: order.customer.address,
        joinDate: order.orderDate,
        lastOrder: order.orderDate,
        totalInvoices: 1,
      };
    } else {
      const lastOrderDate = dayjs(order.orderDate);
      const currentLastOrderDate = dayjs(
        customerSummary[customerName].lastOrder,
      );

      if (lastOrderDate.isAfter(currentLastOrderDate)) {
        customerSummary[customerName].lastOrder =
          lastOrderDate.format("DD MMMM YYYY");
      }

      customerSummary[customerName].totalInvoices += 1;
    }
  });

  const summaryArray: ICustomer[] = Object.values(customerSummary);

  return summaryArray;
};
