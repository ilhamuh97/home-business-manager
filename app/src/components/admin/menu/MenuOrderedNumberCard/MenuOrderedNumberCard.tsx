import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { Card, Radio, RadioChangeEvent } from "antd";
import MonthlyChart from "./MonthlyChart/MonthlyChart";
import WeeklyChart from "./WeeklyChart/WeeklyChart";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // import plugin

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

interface IProps {
  menu: IMenu[];
  orders: IOrder[];
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

const MenuOrderedNumberCard = (props: IProps) => {
  const { menu = [], orders = [] } = props;
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
    const result: any = {};

    menu.forEach((menuItem) => {
      result[menuItem.key] = {
        name: menuItem.name,
        data: Array(12).fill(0),
      };
    });

    let currentDate = dayjs();
    let categories = [];

    for (let i = 0; i < 12; i++) {
      const year = currentDate.year();
      const month = currentDate.month() + 1;

      categories.push(currentDate.format("MMMM YYYY"));

      const filteredInvoices = orders.filter((invoice) => {
        const invoiceDate = dayjs(invoice.orderDate);
        return invoiceDate.year() === year && invoiceDate.month() + 1 === month;
      });

      filteredInvoices.forEach((invoice) => {
        invoice.menu.forEach((menuItem) => {
          const menuKey = menuItem.key;
          result[menuKey].data[i] += menuItem.quantity;
        });
      });

      currentDate = currentDate.subtract(1, "month");
    }

    const resultArray: IRevenueData[] = Object.values<IRevenueData>(result).map(
      (r: IRevenueData) => {
        return {
          name: r.name,
          data: r.data.reverse(),
        };
      },
    );

    setMonthlyData({
      series: resultArray,
      categories: categories.reverse(),
    });
  }, [menu, orders]);

  const calculateWeeklyData = useCallback(() => {
    const last6Months = dayjs().subtract(6, "month").startOf("week");
    const currentWeek = dayjs().startOf("week");
    const calendarWeeks: string[] = [];
    const result: any = {};

    console.log();

    menu.forEach((menuItem) => {
      result[menuItem.key] = {
        name: menuItem.name,
        data: Array(currentWeek.diff(last6Months, "week") + 1).fill(0),
      };
    });

    let i = 0;
    for (
      let date = last6Months.clone();
      date.isSameOrBefore(currentWeek, "week");
      date = date.add(1, "week")
    ) {
      const filteredInvoices = orders.filter((invoice) => {
        const invoiceDate = dayjs(invoice.orderDate);
        return invoiceDate.isSame(date, "week");
      });

      filteredInvoices.forEach((invoice) => {
        invoice.menu.forEach((menuItem) => {
          const menuKey = menuItem.key;
          console.log(menuItem.quantity);
          result[menuKey].data[i] += menuItem.quantity;
        });
      });

      calendarWeeks.push(`CW ${date.week()}`);
      i++;
    }

    console.log(result);

    const resultArray: IRevenueData[] = Object.values<IRevenueData>(result).map(
      (r: IRevenueData) => {
        return {
          name: r.name,
          data: r.data,
        };
      },
    );

    setMonthlyData({
      series: resultArray,
      categories: calendarWeeks,
    });
  }, [menu, orders]);

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
            series={monthlyData.series}
            categories={monthlyData.categories}
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
    <Card title="Ordered menu" size="small">
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

export default MenuOrderedNumberCard;
