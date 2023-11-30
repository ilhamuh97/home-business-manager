import { Col } from "antd";
import React from "react";
import StatisticCard from "@/app/components/shared/StatisticCard/StatisticCard";
import moment from "moment";

interface IProps {
  ordersCurrYear: any[];
}

const StatisticsCards = (props: IProps) => {
  const { ordersCurrYear } = props;
  const GRANULARITY: moment.unitOfTime.StartOf | undefined = "month";
  const CURR_DATE = moment().add(1, GRANULARITY);
  const OLD_DATE = moment();

  const getFilteredOrder = (
    ordersCurrYear: any[],
    date: moment.Moment,
    granularity: moment.unitOfTime.StartOf | undefined,
  ) => {
    return ordersCurrYear.filter((order) =>
      moment(order.shipmentDate).isSame(date, granularity),
    );
  };

  const getOrdersNumberOfMonth = (
    ordersCurrYear: any[],
    date: moment.Moment,
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
    ordersCurrYear: any[],
    date: moment.Moment,
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
          (menuTotal: number, menu: any) => menuTotal + menu.quantity,
          0,
        )
      );
    }, 0);

    return totalMenusOrdered;
  };

  const getRevenueOfMonth = (
    ordersCurrYear: any[],
    date: moment.Moment,
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
    ordersCurrYear: any[],
    date: moment.Moment,
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
          title="Orders"
          value={getOrdersNumberOfMonth(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrdersNumberOfMonth(ordersCurrYear, CURR_DATE),
            getOrdersNumberOfMonth(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Ordered Menus"
          value={getOrderedMenusNumberOfMonth(ordersCurrYear, CURR_DATE)}
          percentage={getPercentageIncrease(
            getOrderedMenusNumberOfMonth(ordersCurrYear, CURR_DATE),
            getOrderedMenusNumberOfMonth(ordersCurrYear, OLD_DATE),
          )}
          dateRange="monthly"
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
        />
      </Col>
    </>
  );
};

export default StatisticsCards;
