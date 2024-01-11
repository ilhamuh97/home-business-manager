import StatisticCard from "@/components/shared/StatisticCard/StatisticCard";
import { ICustomer } from "@/models/customer.model";
import { getPercentageIncrease } from "@/utils/general";
import { Col } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface IProps {
  customers: ICustomer[];
}

const StatisticsCards = (props: IProps) => {
  const { customers = [] } = props;
  const [newCustomerThisMonth, setNewCustomerThisMonth] = useState(0);
  const [newCustomerLastMonth, setNewCustomerLastMonth] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);

  useEffect(() => {
    const { currentMonth, lastMonth } =
      countNewCustomersInMonthAndLastMonth(customers);
    const customerOrderThisMonth = getOrdersInMonth(customers);

    setNewCustomerThisMonth(currentMonth);
    setNewCustomerLastMonth(lastMonth);
    setOrdersThisMonth(customerOrderThisMonth);
  }, [customers]);

  function countNewCustomersInMonthAndLastMonth(customers: ICustomer[]) {
    const currentMonth = dayjs().month();
    const lastMonth = dayjs().subtract(1, "month").month();

    const newCustomersInCurrentMonth = customers.filter(
      (customer) => dayjs(customer.joinDate).month() === currentMonth,
    ).length;

    const newCustomersInLastMonth = customers.filter(
      (customer) => dayjs(customer.joinDate).month() === lastMonth,
    ).length;

    return {
      currentMonth: newCustomersInCurrentMonth,
      lastMonth: newCustomersInLastMonth,
    };
  }

  const getOrdersInMonth = (customers: ICustomer[]) => {
    const currentMonth = dayjs().month();
    return customers.filter(
      (customer) => dayjs(customer.lastOrder).month() === currentMonth,
    ).length;
  };

  return (
    <>
      <Col span={8}>
        <StatisticCard
          title="Total customers"
          value={customers.length}
          hidePercentage={true}
        />
      </Col>
      <Col span={8}>
        <StatisticCard
          title="Order in this month"
          value={ordersThisMonth}
          hidePercentage={true}
        />
      </Col>
      <Col span={8}>
        <StatisticCard
          title="New customers"
          value={newCustomerThisMonth}
          percentage={getPercentageIncrease(
            newCustomerThisMonth,
            newCustomerLastMonth,
          )}
          dateRange="monthly"
        />
      </Col>
    </>
  );
};

export default StatisticsCards;
