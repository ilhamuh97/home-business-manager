"use client";

import { Col, Row, Spin, Typography } from "antd";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <main>
      <Spin tip="Loading" size="small" spinning={isLoading}>
        <Typography.Title level={5}>Menu</Typography.Title>
        <Row gutter={[10, 10]}>
          <Col span={16}></Col>
          <Col span={8}></Col>
          <Col span={12}></Col>
          <Col span={12}></Col>
        </Row>
      </Spin>
    </main>
  );
}
