"use client";

import { useEffect, useState } from "react";
import { Col, Row, Spin, Typography } from "antd";
import { useAppSelector } from "@/lib/hooks";
import BestSellerCard from "@/components/admin/dashboard/BestSellerCard/BestSellerCard";
import LoyalCustomersCard from "@/components/admin/dashboard/LoyalCustomersCard/LoyalCustomersCard";
import OngoingOrdersCard from "@/components/admin/dashboard/OngoingOrdersCard/OngoingOrdersCard";
import RevenueCard from "@/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { IFeedBack, IOrder } from "@/models/order.model";

export default function Home() {
  const orderSlice = useAppSelector((state) => state.orderSlice);
  const [ordersDone, setOrdersDone] = useState<IOrder[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(orderSlice.loading);

    if (orderSlice.success) {
      setOrders([...orderSlice.orders]);

      const orderDataDone: IOrder[] = orderSlice.orders.filter(
        (order: IOrder) =>
          order.extraInformation.feedback.toLowerCase() === IFeedBack.DONE,
      );

      setOrdersDone([...orderDataDone]);
    }
  }, [orderSlice]);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Typography.Title level={5}>Overview</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards orders={ordersDone} />
          <Col span={16}>
            <RevenueCard orders={ordersDone} />
          </Col>
          <Col span={8}>
            <BestSellerCard orders={ordersDone} />
          </Col>
          <Col span={12}>
            <OngoingOrdersCard orders={orders} />
          </Col>
          <Col span={12}>
            <LoyalCustomersCard orders={ordersDone} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
