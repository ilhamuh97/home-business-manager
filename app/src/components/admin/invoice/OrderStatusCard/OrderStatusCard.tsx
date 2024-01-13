import MyChart from "@/components/shared/MyChart/MyChart";
import { IFeedBack, IOrder } from "@/models/order.model";
import { getFilteredOrder } from "@/utils/order";
import { Card, Col, DatePicker, Radio, Row } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs, { OpUnitType } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";

interface IProps {
  orders: IOrder[];
}

const OrderStatusCard = (props: IProps) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const GRANULARITY: OpUnitType = "month";
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().startOf("month");
  };
  const [dateRange, setDateRange] = useState<string>("");

  useEffect(() => {
    if (dateRange) {
      const currDate = dayjs(dateRange);
      const filteredOrder = getFilteredOrder(
        props.orders,
        currDate,
        GRANULARITY,
      );
      setOrders(filteredOrder);
    } else {
      setOrders(props.orders);
    }
  }, [props.orders, dateRange]);

  const dateRangeString = useCallback((dateRange: string): string => {
    if (!dateRange) {
      return "";
    }
    return `in ${dayjs(dateRange).format("MMMM YYYY").toString()}`;
  }, []);

  const doneOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.DONE,
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.DELIVERED,
  ).length;
  const paidOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.PAID,
  ).length;
  const canceledOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.CANCELED,
  ).length;
  const notStatusOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.NOSTATUS,
  ).length;

  const chartData = {
    series: [
      doneOrders,
      deliveredOrders,
      paidOrders,
      canceledOrders,
      notStatusOrders,
    ],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Completed", "Delivered", "Paid", "Canceled", "No Status"],
      legend: {
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const handleChange: DatePickerProps["onChange"] = (_, dateString) => {
    if (dateString) {
      const momentDate = dayjs(dateString).toString();
      setDateRange(momentDate);
    } else {
      setDateRange("");
    }
  };

  return (
    <Card
      title={`Order status distribution ${dateRangeString(dateRange)}`}
      size="small"
      style={{
        height: "100%",
      }}
    >
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <DatePicker
            picker="month"
            onChange={handleChange}
            disabledDate={disabledDate}
          />
        </Col>
        <Col span={24}>
          <MyChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={300}
            width={"100%"}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OrderStatusCard;
