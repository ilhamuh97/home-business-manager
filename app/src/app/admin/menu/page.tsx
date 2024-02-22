"use client";

import BestSellerCard from "@/components/admin/dashboard/BestSellerCard/BestSellerCard";
import MenuList from "@/components/admin/menu/MenuList/MenuList";
import MenuOrderedNumberCard from "@/components/admin/menu/MenuOrderedNumberCard/MenuOrderedNumberCard";
import StatisticsCards from "@/components/admin/menu/StatisticsCards/StatisticsCards";
import { useAppSelector } from "@/lib/hooks";
import { IFeedBack } from "@/models/order.model";
import { Col, Row, Spin, Typography } from "antd";

export default function Home() {
  const orders = useAppSelector((state) => state.orderSlice.orders).filter(
    (order) =>
      order.extraInformation.feedback.toLowerCase() !== IFeedBack.CANCELED,
  );
  const ordersLoading = useAppSelector((state) => state.orderSlice.loading);
  const menu = useAppSelector((state) => state.menuSlice.menu);
  const menuLoading = useAppSelector((state) => state.menuSlice.loading);

  return (
    <main>
      <Spin tip="Loading" size="small" spinning={ordersLoading || menuLoading}>
        <Typography.Title level={5}>Menu</Typography.Title>
        <Row gutter={[10, 10]}>
          <StatisticsCards menu={menu} orders={orders} />
          <Col span={16}>
            <MenuOrderedNumberCard menu={menu} orders={orders} />
          </Col>
          <Col span={8}>
            <BestSellerCard orders={orders} />
          </Col>
          <Col span={24}>
            <MenuList menu={menu} />
          </Col>
        </Row>
      </Spin>
    </main>
  );
}
