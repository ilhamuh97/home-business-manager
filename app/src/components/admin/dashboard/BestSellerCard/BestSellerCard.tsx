import { Card, DatePicker } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import React, { useCallback, useEffect, useState } from "react";
import dayjs, { OpUnitType } from "dayjs";
import MyChart from "@/components/shared/MyChart/MyChart";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { getFilteredOrder } from "@/utils/order";

interface IProps {
  orders: IOrder[];
}

const BestSellerCard = (props: IProps) => {
  const { orders } = props;
  const [dateRange, setDateRange] = useState<string>("");
  const [menuQuantities, setMenuQuantites] = useState<IMenu[]>([]);
  const GRANULARITY: OpUnitType = "month";

  useEffect(() => {
    if (!dateRange) {
      const lastMonth = dayjs().subtract(1, "month").toString();
      setDateRange(lastMonth);
    }
    const currDate = dayjs(dateRange);
    getOrderedMenusNumber(orders, currDate);
  }, [dateRange, orders]);

  const dateRangeString = useCallback((dateRange: string): string => {
    if (!dateRange) {
      return "";
    }
    return dayjs(dateRange).format("MMMM YYYY").toString();
  }, []);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().startOf("month");
  };

  const getOrderedMenusNumber = (orders: IOrder[], date: dayjs.Dayjs) => {
    if (orders.length === 0) return [];

    const tempMenuQuantities: IMenu[] = [];
    getFilteredOrder(orders, date, GRANULARITY).forEach((order) => {
      order.menu.forEach(({ key, name, quantity = 0 }: IMenu) => {
        const existingMenusQuantity = tempMenuQuantities.find(
          (mQ) => mQ.key === key,
        );

        if (existingMenusQuantity) {
          existingMenusQuantity.quantity =
            (existingMenusQuantity.quantity || 0) + quantity;
        } else {
          tempMenuQuantities.push({ key, name, quantity });
        }
      });
    });

    tempMenuQuantities.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
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
        id="date"
        name="date"
        picker="month"
        onChange={handleChange}
        defaultValue={dayjs().subtract(1, "month").startOf("m")}
        disabledDate={disabledDate}
        allowClear={false}
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
