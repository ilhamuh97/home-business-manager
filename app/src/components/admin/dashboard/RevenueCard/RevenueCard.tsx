import { Card, Radio, RadioChangeEvent } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // import plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // import plugin
import isoWeek from "dayjs/plugin/isoWeek";

import MonthlyChart from "./MonthlyChart/MonthlyChart";
import WeeklyChart from "./WeeklyChart/WeeklyChart";
import { IOrder } from "@/models/order.model";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

interface IProps {
  orders: IOrder[];
}

interface IRevenueData {
  name: string;
  data: number[];
}

interface ISeriesAndCategories {
  series: IRevenueData[];
  categories: any;
}

enum RevenuDateRange {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUALLY = "annually",
}

const RevenueCard = (props: IProps) => {
  const { orders = [] } = props;
  const [selectedDateRange, setSelectedDateRange] = useState<RevenuDateRange>(
    RevenuDateRange.MONTHLY,
  );
  const [monthlyData, setMonthlyData] = useState<ISeriesAndCategories>({
    series: [],
    categories: [],
  });
  const [weeklyData, setWeeklyData] = useState<ISeriesAndCategories>({
    series: [],
    categories: [],
  });

  const calculateMonthlyData = useCallback(() => {
    const filteredData = orders.filter(
      (order) => order.extraInformation.feedback.toLowerCase() === "done",
    );

    let currentDate = dayjs().endOf("year");
    let categories = [];
    let results = [];

    for (let i = 0; i < 12; i++) {
      categories.push(currentDate.format("MMM YY"));

      const seriesDataCurrYear = filteredData.reduce((count, order) => {
        const priceInK = order.payment.totalPrice / 1000;
        const orderDate = dayjs(order.orderDate);
        return (
          count +
          (orderDate.isSame(currentDate, "month") &&
          orderDate.isSame(currentDate, "year")
            ? priceInK
            : 0)
        );
      }, 0);
      results.push(seriesDataCurrYear);

      currentDate = currentDate.subtract(1, "month");
    }

    setMonthlyData({
      series: [
        {
          name: "Monthly invoices",
          data: results.reverse(),
        },
      ],
      categories: categories.reverse(),
    });
  }, [orders]);

  const calculateWeeklyData = useCallback((): void => {
    const last6Months = dayjs().subtract(6, "month").startOf("isoWeek");
    const currentWeek = dayjs().startOf("isoWeek");
    const resultArray: number[] = [];
    const calendarWeeks: string[] = [];

    for (
      let date = last6Months.clone();
      date.isSameOrBefore(currentWeek, "week");
      date = date.add(1, "week")
    ) {
      const totalQuantityThisWeek: number = orders
        .filter((order: IOrder) => dayjs(order.orderDate).isSame(date, "week"))
        .reduce((acc, curr) => {
          acc = acc + curr.payment.totalPrice;
          return acc;
        }, 0);

      resultArray.push(totalQuantityThisWeek / 1000);
      calendarWeeks.push(`${date.startOf("isoWeek").format("DD-MMM-YY")}`);
    }

    setWeeklyData({
      series: [
        {
          name: "Weekly revenue",
          data: resultArray,
        },
      ],
      categories: calendarWeeks,
    });
  }, [orders]);

  const updateData = useCallback(
    (key: RevenuDateRange) => {
      switch (key) {
        case RevenuDateRange.WEEKLY:
          setSelectedDateRange(RevenuDateRange.WEEKLY);
          calculateWeeklyData();
          break;
        case RevenuDateRange.MONTHLY:
          setSelectedDateRange(RevenuDateRange.MONTHLY);
          calculateMonthlyData();
          break;
        case RevenuDateRange.ANNUALLY:
          setSelectedDateRange(RevenuDateRange.ANNUALLY);
          break;
      }
    },
    [calculateMonthlyData, calculateWeeklyData],
  );

  useEffect(() => {
    updateData(selectedDateRange);
  }, [selectedDateRange, updateData]);

  const handleChange = (e: RadioChangeEvent) => {
    updateData(e.target.value);
  };

  const getMyChart = (selectedDateRange: RevenuDateRange) => {
    switch (selectedDateRange) {
      case RevenuDateRange.WEEKLY:
        return (
          <WeeklyChart
            series={weeklyData.series}
            categories={weeklyData.categories}
          />
        );
      case RevenuDateRange.MONTHLY:
        return (
          <MonthlyChart
            series={monthlyData.series}
            categories={monthlyData.categories}
          />
        );
      case RevenuDateRange.ANNUALLY:
        return (
          <MonthlyChart
            series={monthlyData.series}
            categories={monthlyData.categories}
          />
        );
    }
  };

  return (
    <Card title="Revenue report in (K)" size="small">
      <Radio.Group
        id="date-range"
        name="date-range"
        style={{ marginBottom: 8 }}
        defaultValue={selectedDateRange}
        size="small"
        onChange={handleChange}
      >
        <Radio.Button value="weekly">Weekly</Radio.Button>
        <Radio.Button value="monthly">Monthly</Radio.Button>
        <Radio.Button value="annually" disabled>
          Annually
        </Radio.Button>
      </Radio.Group>
      {getMyChart(selectedDateRange)}
    </Card>
  );
};

export default RevenueCard;
