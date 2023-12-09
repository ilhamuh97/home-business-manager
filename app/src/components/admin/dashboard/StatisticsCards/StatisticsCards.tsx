import { Col } from "antd";
import React from "react";
import dayjs, { OpUnitType } from "dayjs";
import StatisticCard from "@/components/shared/StatisticCard/StatisticCard";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { getFilteredOrder } from "@/utils/order";

interface IProps {
  ordersCurrYear: IOrder[];
}

const StatisticsCards = (props: IProps) => {
  const ordersCurrYear = props.ordersCurrYear.filter(
    (order) => order.extraInformation.feedback === "done",
  );
  const GRANULARITY: OpUnitType = "month";
  const CURR_DATE = dayjs();
  const OLD_DATE = CURR_DATE.clone().subtract(1, GRANULARITY);

  const getOrdersNumberOfMonth = (
    ordersCurrYear: IOrder[],
    date: dayjs.Dayjs,
  ) => {
    if (ordersCurrYear.length === 0) {
      return 0;
    }
    return getFilteredOrder(ordersCurrYear, date, GRANULARITY).reduce(
      (count) => {
        return count + 1;
      },
      0,
    );
  };

  const getOrderedMenusNumberOfMonth = (
    ordersCurrYear: IOrder[],
    date: dayjs.Dayjs,
  ) => {
    if (ordersCurrYear.length === 0) {
      return 0;
    }

    const totalMenusOrdered = getFilteredOrder(
      ordersCurrYear,
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

  const getRevenueOfMonth = (
    ordersCurrYear: IOrder[],
    date: dayjs.Dayjs,
  ): number => {
    if (ordersCurrYear.length === 0) {
      return 0;
    }
    return getFilteredOrder(ordersCurrYear, date, GRANULARITY).reduce(
      (count, order) => {
        const priceInK = order.payment.totalPrice / 1000;
        return count + priceInK;
      },
      0,
    );
  };

  const getCustomersNumber = (
    ordersCurrYear: IOrder[],
    date: dayjs.Dayjs,
  ): number => {
    if (ordersCurrYear.length === 0) {
      return 0;
    }
    return getFilteredOrder(ordersCurrYear, date, GRANULARITY)
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
          value={getRevenueOfMonth(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getRevenueOfMonth(ordersCurrYear, CURR_DATE),
            getRevenueOfMonth(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Invoices"
          value={getOrdersNumberOfMonth(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrdersNumberOfMonth(ordersCurrYear, CURR_DATE),
            getOrdersNumberOfMonth(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/order"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Total menus"
          value={getOrderedMenusNumberOfMonth(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrderedMenusNumberOfMonth(ordersCurrYear, CURR_DATE),
            getOrderedMenusNumberOfMonth(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/menu"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Customers"
          value={getCustomersNumber(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getCustomersNumber(ordersCurrYear, CURR_DATE),
            getCustomersNumber(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
          redirect="/admin/customer"
        />
      </Col>
    </>
  );
};

export default StatisticsCards;
