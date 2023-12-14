import { IOrder } from "../models/order.model";
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

export const getPercentageIncrease = (
  newValue: number,
  oldValue: number,
): number => {
  if (oldValue === 0) {
    return 0;
  }
  return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
};
