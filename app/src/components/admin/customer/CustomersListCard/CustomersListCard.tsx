import { IOrder } from "@/models/order.model";
import { generateCustomerInvoiceSummary } from "@/utils/order";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

dayjs.extend(relativeTime);
interface IProps {
  orders: IOrder[];
}

interface IDataSource {
  name: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  lastOrder: string;
  totalInvoices: number;
}

const CustomersListCard = (props: IProps) => {
  const { orders = [] } = props;

  const dataSource: IDataSource[] = generateCustomerInvoiceSummary(orders)
    .map((customer) => {
      return {
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        joinDate: dayjs(customer.joinDate).fromNow(),
        lastOrder: dayjs(customer.lastOrder).fromNow(),
        totalInvoices: customer.totalInvoices,
      };
    })
    .sort((a, b) => b.totalInvoices - a.totalInvoices);

  const columns: ColumnsType<IDataSource> = [
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
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
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
    <Card title="Customer list">
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          pageSize: 15,
        }}
      ></Table>
    </Card>
  );
};

export default CustomersListCard;
