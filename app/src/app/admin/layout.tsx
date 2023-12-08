"use client";

import React, { useState } from "react";
import { Button, Layout, Menu, Avatar, Typography } from "antd";
import styles from "./layout.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { sidebarItems } from "@/constants/sidebarItems";
import { MdFoodBank } from "react-icons/md";

const { Header, Content, Footer, Sider } = Layout;

export default function AboutLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = sidebarItems;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMenuClick = ({ key }: any): void => {
    router.push(key);
  };

  return (
    <Layout className={styles.dashboardLayout} hasSider>
      <div className={collapsed ? styles.close : styles.open}></div>
      <Sider
        className={styles.sider}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={`${styles.logo} ${collapsed ? styles.closed : ""}`}>
          <MdFoodBank />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={["sub1"]}
          items={items}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.header}>
          <Button onClick={toggleCollapsed} ghost>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Avatar className={styles.avatar} icon={<UserOutlined />} />
        </Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>
          <Typography.Text className={styles.text}>
            Home Business Manager ©2023
          </Typography.Text>
        </Footer>
      </Layout>
    </Layout>
  );
}
