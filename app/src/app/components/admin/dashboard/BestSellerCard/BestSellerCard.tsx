import MyChart from "@/app/components/shared/MyChart/MyChart";
import { getFilteredOrder } from "@/app/utils/order";
import { Card, DatePicker } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import React, { useCallback, useEffect, useState } from "react";
import dayjs, { OpUnitType } from "dayjs";
import { IOrder } from "@/app/models/order.model";
import { IMenu } from "@/app/models/menu.model";

interface IProps {
  ordersCurrYear: IOrder[];
}

const BestSellerCard = (props: IProps) => {
  const { ordersCurrYear } = props;
  const [dateRange, setDateRange] = useState<string>("");
  const [menuQuantities, setMenuQuantites] = useState<IMenu[]>([]);
  const GRANULARITY: OpUnitType = "month";

  useEffect(() => {
    if (!dateRange) {
      const lastMonth = dayjs().subtract(1, "month").toString();
      setDateRange(lastMonth);
    }
    const currDate = dayjs(dateRange);
    getOrderedMenusNumber(ordersCurrYear, currDate);
  }, [dateRange, ordersCurrYear]);

  const dateRangeString = useCallback((dateRange: string): string => {
    if (!dateRange) {
      return "";
    }
    return dayjs(dateRange).format("MMMM YYYY").toString();
  }, []);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().startOf("month");
  };

  const getOrderedMenusNumber = (
    ordersCurrYear: IOrder[],
    date: dayjs.Dayjs,
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
        data: menuQuantities.map((m: IMenu) => m.quantity).slice(0, 5),
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
        categories: menuQuantities.map((m: IMenu) => m.name).slice(0, 5),
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
    const momentDate = dayjs(dateString).toString();
    setDateRange(momentDate);
  };

  return (
    <Card title={`Best seller ${dateRangeString(dateRange)}`} size="small">
      <DatePicker
        picker="month"
        onChange={handleChange}
        defaultValue={dayjs().subtract(1, "month").startOf("m")}
        disabledDate={disabledDate}
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
