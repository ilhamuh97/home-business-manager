import MyChart from "@/app/components/shared/MyChart/MyChart";
import { getFilteredOrder } from "@/app/utils/order";
import { Card, DatePicker } from "antd";
import { DatePickerProps } from "antd/es/date-picker";
import moment, { DurationInputArg2 } from "moment";
import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { IOrder } from "@/app/models/order.model";
import { IMenu } from "@/app/models/menu.model";

interface IProps {
  ordersCurrYear: IOrder[];
}

const BestSellerCard = (props: IProps) => {
  const { ordersCurrYear } = props;
  const [dateRange, setDateRange] = useState<string>("");
  const [menuQuantities, setMenuQuantites] = useState<IMenu[]>([]);
  const GRANULARITY: DurationInputArg2 = "month";

  useEffect(() => {
    if (!dateRange) {
      const lastMonth = moment().subtract(1, "month").toString();
      setDateRange(lastMonth);
    }
    const currDate = moment(dateRange);
    getOrderedMenusNumber(ordersCurrYear, currDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, ordersCurrYear]);

  const dateRangeString = useCallback((dateRange: string): string => {
    if (!dateRange) {
      return "";
    }
    return moment(dateRange).format("MMMM yyyy").toString();
  }, []);

  const getOrderedMenusNumber = (
    ordersCurrYear: IOrder[],
    date: moment.Moment,
  ) => {
    if (ordersCurrYear.length === 0) return [];

    const tempMenuQuantities: IMenu[] = [];
    getFilteredOrder(ordersCurrYear, date, GRANULARITY).forEach((order) => {
      order.menu.forEach(({ key, name, quantity }: IMenu) => {
        const existingMenusQuantity = tempMenuQuantities.find(
          (mQ) => mQ.key === key,
        );
        existingMenusQuantity
          ? (existingMenusQuantity.quantity += quantity)
          : tempMenuQuantities.push({ key, name, quantity });
      });
    });

    tempMenuQuantities.sort((a, b) => b.quantity - a.quantity);
    setMenuQuantites(tempMenuQuantities);
  };

  const chartData = {
    series: [
      {
        data: menuQuantities.map((m: IMenu) => m.quantity).slice(0, 10),
      },
    ],
    options: {
      plotOptions: {
        bar: {
          borderRadius: 4,
          distributed: true,
          horizontal: true,
        },
      },
      xaxis: {
        categories: menuQuantities.map((m: IMenu) => m.key).slice(0, 10),
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
        },
        formatter: function (val: string) {
          return val;
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  };

  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    const momentDate = moment(dateString).toString();
    setDateRange(momentDate);
  };

  return (
    <Card title={`Best seller ${dateRangeString(dateRange)}`} size="small">
      <DatePicker
        picker="month"
        onChange={handleChange}
        defaultValue={dayjs().subtract(1, "month").startOf("m")}
      />
      <MyChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={300}
        width={"100%"}
      />
    </Card>
  );
};

export default BestSellerCard;
