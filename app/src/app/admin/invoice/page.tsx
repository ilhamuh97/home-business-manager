"use client";

import OrderNumberCard from "@/components/admin/invoice/OrderNumberCard/OrderNumberCard";
import OrderRecordsCard from "@/components/admin/invoice/OrderRecordsCard/OrderRecordsCard";
import OrderStatusCard from "@/components/admin/invoice/OrderStatusCard/OrderStatusCard";
import StatisticsCards from "@/components/admin/invoice/StatisticsCards/StatisticsCards";
import { useAppSelector } from "@/lib/hooks";
import { Col, Row, Spin, Typography } from "antd";
import { useEffect } from "react";

export default function Home() {
  const orders = useAppSelector((state) => state.orderSlice.orders);
  const ordersLoading = useAppSelector((state) => state.orderSlice.loading);
  return (
    <main>
      <Spin tip="Loading" size="small" spinning={ordersLoading}>
        <Typography.Title level={5}>Invoices</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards orders={orders} />
          <Col span={16}>
            <OrderNumberCard data={orders} />
          </Col>
          <Col span={8}>
            <OrderStatusCard orders={orders} />
          </Col>
          <Col span={24}>
            <OrderRecordsCard orders={orders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
