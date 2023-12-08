"use client";

import { useEffect, useState } from "react";
import { Col, Row, Spin, Typography, message } from "antd";
import RevenueCard from "@/app/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/app/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { getCustomers, getOrders } from "@/services/dashboard.service";
import BestSellerCard from "@/app/components/admin/dashboard/BestSellerCard/BestSellerCard";
import OngoingOrdersCard from "@/app/components/admin/dashboard/OngoingOrdersCard/OngoingOrdersCard";
import LoyalCustomersCard from "@/app/components/admin/dashboard/LoyalCustomersCard/LoyalCustomersCard";
import { IOrder } from "@/app/models/order.model";
import { ICustomer } from "@/app/models/customer.model";
import dayjs from "dayjs";

export default function Home() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [ordersCurrYear, setOrdersCurrYear] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [orderResponse, customerResponse] = await Promise.all([
          getOrders(),
          getCustomers(),
        ]);

        const ordersResult = await orderResponse.json();
        const customerResult = await customerResponse.json();

        const orderData: IOrder[] = ordersResult.data;
        const customerData: ICustomer[] = customerResult.data;

        const currYear = dayjs();

        const filteredOrder: IOrder[] = orderData.filter((order: IOrder) =>
          dayjs(order.orderDate).isSame(currYear, "year"),
        );

        setOrders(orderData);
        setCustomers(customerData);
        setOrdersCurrYear(filteredOrder);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orders.length === 0) {
      fetchData();
    }
  }, [orders]);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Typography.Title level={5}>Overview</Typography.Title>
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
            <LoyalCustomersCard customers={customers} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
