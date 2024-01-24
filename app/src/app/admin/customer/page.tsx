"use client";

import CustomerGrowth from "@/components/admin/customer/CustomerGrowth/CustomerGrowth";
import CustomersListCard from "@/components/admin/customer/CustomersListCard/CustomersListCard";
import StatisticsCards from "@/components/admin/customer/StatisticsCards/StatisticsCards";
import { useAppSelector } from "@/lib/hooks";
import { ICustomer } from "@/models/customer.model";
import { IOrder } from "@/models/order.model";
import { getOrders } from "@/services/dashboard.service";
import { handleApiError } from "@/utils/error";
import { generateCustomerInvoiceSummary } from "@/utils/order";
import { Col, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

export default function Home() {
  const orders = useAppSelector((state) => state.orderSlice.orders);
  const ordersLoading = useAppSelector((state) => state.orderSlice.loading);
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    if (orders.length > 0 && !ordersLoading) {
      setCustomers(generateCustomerInvoiceSummary(orders));
    }
  }, [orders, ordersLoading]);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={ordersLoading}>
        <Typography.Title level={5}>Customer</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards customers={customers} />
          <Col span={24}>
            <CustomerGrowth customers={customers} />
          </Col>
          <Col span={24}>
            <CustomersListCard orders={orders} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
