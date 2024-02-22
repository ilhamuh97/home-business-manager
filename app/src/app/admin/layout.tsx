"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Menu,
  Typography,
  Dropdown,
  MenuProps,
  message,
} from "antd";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { SIDEBAR_ITEMS } from "@/constants/sidebarItems";
import Logo from "../../assets/VizConnect.svg";
import { getToken, logout } from "@/utils/auth";
import styles from "./layout.module.scss";
import { fetchOrders } from "@/lib/features/order/orderSlice";
import { fetchMenu } from "@/lib/features/menu/menuSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Image from "next/image";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { Header, Content, Footer, Sider } = Layout;

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = getToken();
        if (token) {
          setIsAuth(true);
          const [ordersResultAction, menuResultAction] = await Promise.all([
            dispatch(fetchOrders([])),
            dispatch(fetchMenu([])),
          ]);
          const ordersResult = unwrapResult(ordersResultAction);
          const menuResult = unwrapResult(menuResultAction);
          const error = [menuResult, ordersResult].find((slice) => {
            return slice.status === "error" && slice.message !== "";
          });

          if (error) {
            if (error.message === "Failed to fetch user data") {
              logout();
              router.push("/login");
            } else {
              message.error(error.message);
            }
          }
        } else {
          setIsAuth(false);
          router.push("/login");
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const onMenuClick = ({ key }: any): void => {
    const token = getToken();
    if (!token) {
      setIsAuth(false);
      router.push("/login");
    } else {
      router.push(key);
    }
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
          <Image src={Logo} alt="VizConnect png" />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={["sub1"]}
          items={SIDEBAR_ITEMS}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.header}>
          <Button onClick={toggleCollapsed} ghost>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button icon={<UserOutlined />} shape="circle" />
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
