import { IOrder } from "@/app/models/order.model";
import { Card, Table } from "antd";
import React from "react";

interface IProps {
  orders: IOrder[];
}

const LoyalCustomersCard = (props: IProps) => {
  // TODO: Use real data
  const orders = props.orders;

  const dataSource = [
    {
      key: "1",
      name: "Mike Thompson",
      phoneNumber: "1 555-0123",
      lastOrder: "18 November 2023",
      totalInvoices: 21,
    },
    {
      key: "2",
      name: "John Wick",
      phoneNumber: "1 555-8901",
      lastOrder: "23 November 2023",
      totalInvoices: 20,
    },
    {
      key: "3",
      name: "Xander Crystalheart",
      phoneNumber: "1 555-0123",
      lastOrder: "25 November 2023",
      totalInvoices: 15,
    },
    {
      key: "4",
      name: "Luna Skydancer",
      phoneNumber: "1 555-8901",
      lastOrder: "10 November 2023",
      totalInvoices: 10,
    },
    {
      key: "5",
      name: "Aurora Silverwing",
      phoneNumber: "1 555-0123",
      lastOrder: "5 November 2023",
      totalInvoices: 10,
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Last Order",
      dataIndex: "lastOrder",
      key: "lastOrder",
    },
    {
      title: "Total Invoices",
      dataIndex: "totalInvoices",
      key: "totalInvoices",
    },
  ];
  return (
    <Card title="Loyal customers" size="small">
      <Table dataSource={dataSource} columns={columns} size="small" />
    </Card>
  );
};

export default LoyalCustomersCard;
