import { Col } from "antd";
import React from "react";
import dayjs, { OpUnitType } from "dayjs";
import StatisticCard from "@/components/shared/StatisticCard/StatisticCard";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { getFilteredOrder } from "@/utils/order";

interface IProps {
  orders: IOrder[];
}

const StatisticsCards = (props: IProps) => {
  const { orders } = props;
  const GRANULARITY: OpUnitType = "month";
  const CURR_DATE = dayjs();
  const OLD_DATE = CURR_DATE.clone().subtract(1, GRANULARITY);

  const getOrdersNumberOfMonth = (orders: IOrder[], date: dayjs.Dayjs) => {
    if (orders.length === 0) {
      return 0;
    }

    return getFilteredOrder(orders, date, GRANULARITY).reduce((count) => {
      return count + 1;
    }, 0);
  };

  const getOrderedMenusNumberOfMonth = (
    orders: IOrder[],
    date: dayjs.Dayjs,
  ) => {
    if (orders.length === 0) {
      return 0;
    }

    const totalMenusOrdered = getFilteredOrder(
      orders,
      date,
      GRANULARITY,
    ).reduce((total, order) => {
      return (
        total +
        order.menu.reduce(
          (menuTotal: number, menu: IMenu) => menuTotal + menu.quantity,
          0,
        )
      );
    }, 0);

    return totalMenusOrdered;
  };

  const getRevenueOfMonth = (orders: IOrder[], date: dayjs.Dayjs): number => {
    if (orders.length === 0) {
      return 0;
    }
    return getFilteredOrder(orders, date, GRANULARITY).reduce(
      (count, order) => {
        const priceInK = order.payment.totalPrice / 1000;
        return count + priceInK;
      },
      0,
    );
  };

  const getCustomersNumber = (orders: IOrder[], date: dayjs.Dayjs): number => {
    if (orders.length === 0) {
      return 0;
    }
    return getFilteredOrder(orders, date, GRANULARITY)
      .map((order) => order.customer.phoneNumber)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }).length;
  };

  const getPercentageIncrease = (
    newValue: number,
    oldValue: number,
  ): number => {
    if (oldValue === 0) {
      return 0;
    }
    return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
  };

  return (
    <>
      <Col span={6}>
        <StatisticCard
          title="Revenue"
          suffix="K"
          value={getRevenueOfMonth(orders, CURR_DATE)}
          percentage={getPercentageIncrease(
            getRevenueOfMonth(orders, CURR_DATE),
            getRevenueOfMonth(orders, OLD_DATE),
          )}
          dateRange="monthly"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Invoices"
          value={getOrdersNumberOfMonth(orders, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrdersNumberOfMonth(orders, CURR_DATE),
            getOrdersNumberOfMonth(orders, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/invoice"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Total menus"
          value={getOrderedMenusNumberOfMonth(orders, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrderedMenusNumberOfMonth(orders, CURR_DATE),
            getOrderedMenusNumberOfMonth(orders, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/menu"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Customers"
          value={getCustomersNumber(orders, CURR_DATE)}
          percentage={getPercentageIncrease(
            getCustomersNumber(orders, CURR_DATE),
            getCustomersNumber(orders, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/customer"
        />
      </Col>
    </>
  );
};

export default StatisticsCards;
