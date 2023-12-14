import { SettingOutlined, BarChartOutlined } from "@ant-design/icons";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_DEV;
export const SIDEBAR_ITEMS = [
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
