import moment from "moment";
import { IOrder } from "../models/order.model";

export const getFilteredOrder = (
  ordersCurrYear: IOrder[],
  date: moment.Moment,
  granularity: moment.unitOfTime.StartOf | undefined,
) => {
  return ordersCurrYear.filter((order) =>
    moment(order.shipmentDate).isSame(date, granularity),
  );
};
