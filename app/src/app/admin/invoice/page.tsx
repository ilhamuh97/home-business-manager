"use client";

import OrderNumberCard from "@/components/admin/invoice/OrderNumberCard/OrderNumberCard";
import OrderRecordsCard from "@/components/admin/invoice/OrderRecordsCard/OrderRecordsCard";
import OrderStatusCard from "@/components/admin/invoice/OrderStatusCard/OrderStatusCard";
import StatisticsCards from "@/components/admin/invoice/StatisticsCards/StatisticsCards";
import { IOrder } from "@/models/order.model";
import { getOrders } from "@/services/dashboard.service";
import { handleApiError } from "@/utils/error";
import { Col, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [rawOrders, setRawOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const orderResponse = await getOrders();

        const ordersResult = await handleApiError(orderResponse);
        setRawOrders(ordersResult.data);
      } catch (error: any) {
        console.log(error);
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!rawOrders.length) {
      fetchData();
    }
  }, [rawOrders]);
  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Typography.Title level={5}>Invoices</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards orders={rawOrders} />
          <Col span={16}>
            <OrderNumberCard data={rawOrders} />
          </Col>
          <Col span={8}>
            <OrderStatusCard orders={rawOrders} />
          </Col>
          <Col span={24}>
            <OrderRecordsCard orders={rawOrders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
