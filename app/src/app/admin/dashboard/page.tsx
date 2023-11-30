"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row, Spin, message } from "antd";
import RevenueCard from "@/app/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/app/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { getOrders } from "@/services/dashboard.service";

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersCurrYear, setOrdersCurrYear] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getOrders();
        const ordersResult = await data.json();
        const orderData = ordersResult.data;
        const currYear = moment();
        const filteredOrder = orderData.filter((order: any) => {
          const orderDate = moment(order.shipmentDate);
          return orderDate.isSame(currYear, "year");
        });
        setOrders(orderData);
        setOrdersCurrYear(filteredOrder);
        setIsLoading(false);
      } catch (error: any) {
        message.error(error.message);
      }
    };

    if (orders.length === 0) {
      fetchData();
    }
  }, [orders]);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Row gutter={[10, 10]}>
          <StatisticsCards ordersCurrYear={ordersCurrYear} />
          <Col span={24}>
            <RevenueCard data={orders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
