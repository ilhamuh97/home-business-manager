import { ICustomer } from "@/app/models/customer.model";
import { IOrder } from "@/app/models/order.model";
import { Card, Table } from "antd";
import React from "react";

interface IProps {
  customers: ICustomer[];
}

const LoyalCustomersCard = (props: IProps) => {
  // TODO: Use real data
  const customers = props.customers;
  const dataSource = customers
    .sort((a, b) => b.totalInvoices - a.totalInvoices)
    .map((customer) => {
      return {
        key: customer.phoneNumber,
        ...customer,
      };
    });
  console.log(dataSource);
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
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          pageSize: 5,
        }}
      />
    </Card>
  );
};

export default LoyalCustomersCard;
