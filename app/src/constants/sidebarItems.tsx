import { SettingOutlined, BarChartOutlined } from "@ant-design/icons";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_DEV;
export const sidebarItems = [
  {
    key: "dashboard",
    icon: <BarChartOutlined />,
    label: "Dashboard",
    children: [
      {
        key: "/admin/dashboard",
        label: "Overview",
      },
      {
        key: "/admin/order",
        label: "Order",
      },
      {
        key: "/admin/menu",
        label: "Menu",
      },
      {
        key: "/admin/customer",
        label: "Customer",
      },
    ],
  },
  {
    key: "/admin/setting",
    icon: <SettingOutlined />,
    label: "Setting",
  },
];
