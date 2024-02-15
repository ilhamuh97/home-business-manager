"use client";

import { useEffect, useState } from "react";
import { Col, Row, Spin, Typography, message } from "antd";
import { useAppSelector } from "@/lib/hooks";
import BestSellerCard from "@/components/admin/dashboard/BestSellerCard/BestSellerCard";
import LoyalCustomersCard from "@/components/admin/dashboard/LoyalCustomersCard/LoyalCustomersCard";
import OngoingOrdersCard from "@/components/admin/dashboard/OngoingOrdersCard/OngoingOrdersCard";
import RevenueCard from "@/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { IFeedBack, IOrder } from "@/models/order.model";
import dayjs from "dayjs";

export default function Home() {
  const orderSlice = useAppSelector((state) => state.orderSlice);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [prevYearOrders, setPrevYearOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(orderSlice.loading);

    if (orderSlice.success) {
      const orderDataDone: IOrder[] = orderSlice.orders.filter(
        (order: IOrder) =>
          order.extraInformation.feedback.toLowerCase() === IFeedBack.DONE,
      );

      setOrders([...orderDataDone]);

      const currYear = dayjs();
      setPrevYearOrders(
        orderDataDone.filter(
          (order: IOrder) => dayjs(order.orderDate).diff(currYear, "year") < 1,
        ),
      );
    }
  }, [orderSlice]);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Typography.Title level={5}>Overview</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards orders={prevYearOrders} />
          <Col span={16}>
            <RevenueCard data={orders} />
          </Col>
          <Col span={8}>
            <BestSellerCard orders={prevYearOrders} />
          </Col>
          <Col span={12}>
            <OngoingOrdersCard orders={orders} />
          </Col>
          <Col span={12}>
            <LoyalCustomersCard orders={orders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
