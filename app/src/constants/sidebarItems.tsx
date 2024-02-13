import { SettingOutlined, BarChartOutlined } from "@ant-design/icons";

export const BASE_URL =
  process.env.NEXT_PUBLIC_DEPLOYMENT === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL_PROD;
export const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    icon: <BarChartOutlined />,
    label: "Dashboard",
    children: [
      {
        key: "/admin/overview",
        label: "Overview",
      },
      {
        key: "/admin/invoice",
        label: "Invoice",
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
