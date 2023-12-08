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
