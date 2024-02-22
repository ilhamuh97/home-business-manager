import { IOrder } from "@/models/order.model";
import { generateCustomerInvoiceSummary } from "@/utils/order";
import { Card, Table } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

dayjs.extend(relativeTime);
interface IProps {
  orders: IOrder[];
}

const LoyalCustomersCard = (props: IProps) => {
  const { orders = [] } = props;
  const dataSource = generateCustomerInvoiceSummary(orders)
    .sort((a, b) => b.totalInvoices - a.totalInvoices)
    .map((customer) => {
      return {
        key: customer.phoneNumber,
        ...customer,
        lastOrder: dayjs(customer.lastOrder).fromNow(),
      };
    });

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
