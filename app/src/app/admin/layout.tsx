"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Menu,
  Avatar,
  Typography,
  Dropdown,
  MenuProps,
  message,
} from "antd";
import styles from "./layout.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { sidebarItems } from "@/constants/sidebarItems";
import { MdFoodBank } from "react-icons/md";
import { getToken, logout } from "@/utils/auth";

const { Header, Content, Footer, Sider } = Layout;

export default function AboutLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = getToken();
      if (token) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        router.push("/login");
      }
    };

    checkAuthentication();
  }, [router]);

  const toggleCollapsed = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const onMenuClick = ({ key }: any): void => {
    router.push(key);
  };

  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === "logout") {
      logout();
      router.push("/login");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return isAuth ? (
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
          items={sidebarItems}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.header}>
          <Button onClick={toggleCollapsed} ghost>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>
          <Typography.Text className={styles.text}>
            Home Business Manager ©2023
          </Typography.Text>
        </Footer>
      </Layout>
    </Layout>
  ) : (
    ""
  );
}
