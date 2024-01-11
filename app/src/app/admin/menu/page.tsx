"use client";

import BestSellerCard from "@/components/admin/dashboard/BestSellerCard/BestSellerCard";
import MenuList from "@/components/admin/menu/MenuList/MenuList";
import StatisticsCards from "@/components/admin/menu/StatisticsCards/StatisticsCards";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { getMenu, getOrders } from "@/services/dashboard.service";
import { handleApiErrors } from "@/utils/error";
import { Col, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [rawOrders, setRawOrders] = useState<IOrder[]>([]);
  const [rawMenu, setRawMenu] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [orderResponse, menuResponse] = await Promise.all([
          getOrders(),
          getMenu(),
        ]);

        const [ordersResult, menuResult] = await handleApiErrors([
          orderResponse,
          menuResponse,
        ]);

        setRawOrders(ordersResult.data);
        setRawMenu(menuResult.data);
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
        <Typography.Title level={5}>Menu</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards menu={rawMenu} orders={rawOrders} />
          <Col span={8}>
            <BestSellerCard orders={rawOrders} />
          </Col>
          <Col span={16}>
            <MenuList menu={rawMenu} />
          </Col>
          <Col span={12}></Col>
          <Col span={12}></Col>
        </Row>
      </Spin>
    </main>
  );
}
