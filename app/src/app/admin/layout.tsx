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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { SIDEBAR_ITEMS } from "@/constants/sidebarItems";
import { MdFoodBank } from "react-icons/md";
import { getToken, logout } from "@/utils/auth";
import styles from "./layout.module.scss";
import { fetchOrders } from "@/lib/features/order/orderSlice";
import { fetchMenu } from "@/lib/features/menu/menuSlice";

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
  const orderSlice = useAppSelector((state) => state.orderSlice);
  const menuSlice = useAppSelector((state) => state.menuSlice);
  const { Header, Content, Footer, Sider } = Layout;

  useEffect(() => {
    const checkAuthentication = () => {
      const token = getToken();
      if (token) {
        setIsAuth(true);
        dispatch(fetchOrders([]));
        dispatch(fetchMenu([]));
      } else {
        setIsAuth(false);
        router.push("/login");
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const error = [menuSlice, orderSlice].find((slice) => {
      return !slice.success && slice.message !== "";
    });

    if (error) {
      if (error.message === "Failed to fetch user data") {
        logout();
        router.push("/login");
      } else {
        message.error(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    menuSlice.success,
    orderSlice.success,
    menuSlice.message,
    orderSlice.message,
    router,
  ]);

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
          <MdFoodBank />
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
