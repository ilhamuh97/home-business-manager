"use client";

import CustomersListCard from "@/components/admin/customer/CustomersListCard/CustomersListCard";
import StatisticsCards from "@/components/admin/customer/StatisticsCards/StatisticsCards";
import { ICustomer } from "@/models/customer.model";
import { IOrder } from "@/models/order.model";
import { getOrders } from "@/services/dashboard.service";
import { handleApiError } from "@/utils/error";
import { generateCustomerInvoiceSummary } from "@/utils/order";
import { Col, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [rawOrders, setRawOrders] = useState<IOrder[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const orderResponse = await getOrders();

        const ordersResult = await handleApiError(orderResponse);
        setRawOrders(ordersResult.data);
        setCustomers(generateCustomerInvoiceSummary(ordersResult.data));
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
        <Typography.Title level={5}>Customer</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards customers={customers} />
          <Col span={24}>
            <CustomersListCard orders={rawOrders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
