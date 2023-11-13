import { SettingOutlined, BarChartOutlined } from "@ant-design/icons";

export const sidebarItems = [
  {
    key: "dashboard",
    icon: <BarChartOutlined />,
    label: "Dashboard",
    children: [
      {
        key: "/admin/dashboard",
        label: "Analysis",
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
