import { Card, Radio, RadioChangeEvent } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import MonthlyChart from "./MonthlyChart/MonthlyChart";
import { ICustomer } from "@/models/customer.model";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import WeeklyChart from "./WeeklyChart/WeeklyChart";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

interface IProps {
  customers: ICustomer[];
}

interface IRevenueData {
  name: string;
  data: number[];
}

interface ISeriesAndCategories {
  series: IRevenueData[];
  categories: string[];
}

enum RevenuDateRange {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUALLY = "annually",
}

const CustomerGrowth = (props: IProps) => {
  const { customers = [] } = props;
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

  const countNewCustomersPerMonth = useCallback(() => {
    let currentDate = dayjs().endOf("year");
    let categories: string[] = [];

    const lastTwelveMonths = Array.from({ length: 12 }, (_, index) =>
      currentDate.subtract(index, "month"),
    );

    const monthlyCounts: number[] = lastTwelveMonths.map((month) => {
      const monthStart = month.startOf("month");
      const monthEnd = month.endOf("month");

      const newCustomers = customers.filter((customer) =>
        dayjs(customer.joinDate).isBetween(monthStart, monthEnd, null, "[]"),
      );

      return newCustomers.length;
    });

    const result: IRevenueData[] = [
      {
        name: "New customers",
        data: Array.from({ length: 12 }, (_, index) => {
          const count = monthlyCounts[index] || 0;
          const label = currentDate.subtract(index, "month").format("MMM YYYY");
          categories.push(label);
          return count;
        }).reverse(),
      },
    ];

    setMonthlyData({
      series: result,
      categories: categories.reverse(),
    });
  }, [customers]);

  const countNewCustomersPerWeekly = useCallback(() => {
    const calendarWeeks: string[] = [];
    const last6Months = dayjs().subtract(6, "month").startOf("isoWeek");
    const currentWeek = dayjs().startOf("isoWeek");

    const data = Array(currentWeek.diff(last6Months, "week") + 1).fill(0);

    let i = 0;
    for (
      let date = last6Months.clone();
      date.isSameOrBefore(currentWeek, "week");
      date = date.add(1, "week")
    ) {
      const filteredCustomer = customers.filter((customer) => {
        const joinDate = dayjs(customer.joinDate);
        return joinDate.isSame(date, "week");
      });

      console.log("date", date.format("DD-MM-YY").toString(), filteredCustomer);
      data[i] = filteredCustomer.length;
      calendarWeeks.push(`${date.startOf("isoWeek").format("DD-MMM-YY")}`);
      i++;
    }

    const result: IRevenueData[] = [
      {
        name: "New customers",
        data,
      },
    ];

    setWeeklyData({
      series: result,
      categories: calendarWeeks,
    });
  }, [customers]);

  const updateData = useCallback(
    (key: RevenuDateRange) => {
      switch (key) {
        case RevenuDateRange.WEEKLY:
          setSelectedDateRange(RevenuDateRange.WEEKLY);
          countNewCustomersPerWeekly();
          break;
        case RevenuDateRange.MONTHLY:
          setSelectedDateRange(RevenuDateRange.MONTHLY);
          countNewCustomersPerMonth();
          break;
        case RevenuDateRange.ANNUALLY:
          setSelectedDateRange(RevenuDateRange.ANNUALLY);
          break;
      }
    },
    [countNewCustomersPerMonth, countNewCustomersPerWeekly],
  );

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

  useEffect(() => {
    updateData(selectedDateRange);
  }, [selectedDateRange, updateData]);

  const handleChange = (e: RadioChangeEvent) => {
    updateData(e.target.value);
  };

  return (
    <Card title="Customer growth" size="small">
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

export default CustomerGrowth;
