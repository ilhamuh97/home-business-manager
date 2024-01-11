"use client";

import { useEffect, useState } from "react";
import { Col, Row, Spin, Typography, message } from "antd";
import { getCustomers, getOrders } from "@/services/dashboard.service";
import dayjs from "dayjs";
import BestSellerCard from "@/components/admin/dashboard/BestSellerCard/BestSellerCard";
import LoyalCustomersCard from "@/components/admin/dashboard/LoyalCustomersCard/LoyalCustomersCard";
import OngoingOrdersCard from "@/components/admin/dashboard/OngoingOrdersCard/OngoingOrdersCard";
import RevenueCard from "@/components/admin/dashboard/RevenueCard/RevenueCard";
import StatisticsCards from "@/components/admin/dashboard/StatisticsCards/StatisticsCards";
import { ICustomer } from "@/models/customer.model";
import { IFeedBack, IOrder } from "@/models/order.model";
import { handleApiErrors } from "@/utils/error";

export default function Home() {
  const [rawOrders, setRawOrders] = useState<IOrder[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [prevYearOrders, setPrevYearOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [orderResponse, customerResponse] = await Promise.all([
          getOrders(),
          getCustomers(),
        ]);

        const [ordersResult, customerResult] = await handleApiErrors([
          orderResponse,
          customerResponse,
        ]);
        setRawOrders(ordersResult.data);
        setCustomers(customerResult.data);

        const orderDataDone: IOrder[] = ordersResult.data.filter(
          (order: IOrder) => order.extraInformation.feedback === IFeedBack.DONE,
        );
        setOrders(orderDataDone);

        const currYear = dayjs();
        setPrevYearOrders(
          orderDataDone.filter(
            (order: IOrder) =>
              dayjs(order.orderDate).diff(currYear, "year") < 1,
          ),
        );
      } catch (error: any) {
        console.log(error);
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!orders.length) {
      fetchData();
    }
  }, [orders]);

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
            <OngoingOrdersCard orders={rawOrders} />
          </Col>
          <Col span={12}>
            <LoyalCustomersCard orders={orders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
