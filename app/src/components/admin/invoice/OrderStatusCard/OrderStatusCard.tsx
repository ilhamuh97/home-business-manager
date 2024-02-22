import MyChart from "@/components/shared/MyChart/MyChart";
import { IFeedBack, IOrder } from "@/models/order.model";
import { getFilteredOrder } from "@/utils/order";
import { Card, Col, DatePicker, Row } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs, { OpUnitType } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";

interface IProps {
  orders: IOrder[];
}

const OrderStatusCard = (props: IProps) => {
  const { orders = [] } = props;
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const GRANULARITY: OpUnitType = "month";
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().startOf("month");
  };
  const [dateRange, setDateRange] = useState<string>("");

  useEffect(() => {
    if (dateRange) {
      const currDate = dayjs(dateRange);
      const filteredOrder = getFilteredOrder(orders, currDate, GRANULARITY);
      setFilteredOrders(filteredOrder);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, dateRange]);

  const dateRangeString = useCallback((dateRange: string): string => {
    if (!dateRange) {
      return "";
    }
    return `in ${dayjs(dateRange).format("MMMM YYYY").toString()}`;
  }, []);

  const doneOrders = filteredOrders.filter(
    (order) => order.extraInformation.feedback.toLowerCase() === IFeedBack.DONE,
  ).length;
  const deliveredOrders = filteredOrders.filter(
    (order) =>
      order.extraInformation.feedback.toLowerCase() === IFeedBack.DELIVERED,
  ).length;
  const paidOrders = filteredOrders.filter(
    (order) => order.extraInformation.feedback.toLowerCase() === IFeedBack.PAID,
  ).length;
  const canceledOrders = filteredOrders.filter(
    (order) =>
      order.extraInformation.feedback.toLowerCase() === IFeedBack.CANCELED,
  ).length;
  const notStatusOrders = filteredOrders.filter(
    (order) =>
      order.extraInformation.feedback.toLowerCase() === IFeedBack.NOSTATUS,
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
            id="date"
            name="date"
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
