import { TbFileInvoice } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { AiOutlineDashboard } from "react-icons/ai";

export const BASE_URL =
  process.env.NEXT_PUBLIC_DEPLOYMENT === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL_PROD;
export const SIDEBAR_ITEMS = [
  {
    key: "/admin/overview",
    label: "Overview",
    icon: <AiOutlineDashboard />,
  },
  {
    key: "/admin/invoice",
    label: "Invoice",
    icon: <TbFileInvoice />,
  },
  {
    key: "/admin/menu",
    label: "Menu",
    icon: <IoFastFoodOutline />,
  },
  {
    key: "/admin/customer",
    label: "Customer",
    icon: <GoPeople />,
  },
];
