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
  key: string;
  name: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  lastOrder: string;
  totalInvoices: number;
  totalSpend: number;
}

const CustomersListCard = (props: IProps) => {
  const { orders = [] } = props;

  const dataSource: IDataSource[] = generateCustomerInvoiceSummary(orders)
    .map((customer) => {
      return {
        key: customer.phoneNumber,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        joinDate: customer.joinDate,
        lastOrder: dayjs(customer.lastOrder).fromNow(),
        totalInvoices: customer.totalInvoices,
        totalSpend: customer.totalSpend || 0,
      };
    })
    .sort((a, b) => b.totalInvoices - a.totalInvoices);

  const columns: ColumnsType<IDataSource> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: Array.from(new Set(dataSource.map((data) => data.name))).map(
        (name) => {
          return {
            text: name,
            value: name,
          };
        },
      ),
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value as string),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      filters: Array.from(
        new Set(dataSource.map((data) => data.phoneNumber)),
      ).map((phoneNumber) => {
        return {
          text: phoneNumber,
          value: phoneNumber,
        };
      }),
      filterSearch: true,
      onFilter: (value, record) =>
        record.phoneNumber.startsWith(value as string),
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
      sorter: (a, b) => a.totalInvoices - b.totalInvoices,
    },
    {
      title: "Total Spend Prices",
      dataIndex: "totalSpend",
      key: "totalSpend",
      render: (totalSpend: number) => {
        return new Intl.NumberFormat("en-ID").format(totalSpend);
      },
      sorter: (a, b) => a.totalSpend - b.totalSpend,
    },
  ];

  return (
    <Card title="Customers">
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
