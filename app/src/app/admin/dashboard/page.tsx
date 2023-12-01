"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row, Spin, message } from "antd";
import RevenueCard from "@/app/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/app/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { getOrders } from "@/services/dashboard.service";
import BestSellerCard from "@/app/components/admin/dashboard/BestSellerCard/BestSellerCard";
import OngoingOrdersCard from "@/app/components/admin/dashboard/OngoingOrdersCard/OngoingOrdersCard";
import LoyalCustomersCard from "@/app/components/admin/dashboard/LoyalCustomersCard/LoyalCustomersCard";
import { IOrder } from "@/app/models/order.model";

export default function Home() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [ordersCurrYear, setOrdersCurrYear] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getOrders();
        const ordersResult = await data.json();
        const orderData = ordersResult.data;
        const currYear = moment();
        const filteredOrder = orderData.filter((order: IOrder) => {
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
          <Col span={16}>
            <RevenueCard data={orders} />
          </Col>
          <Col span={8}>
            <BestSellerCard ordersCurrYear={ordersCurrYear} />
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
