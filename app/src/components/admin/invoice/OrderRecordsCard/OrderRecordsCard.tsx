import { ICustomer } from "@/models/customer.model";
import { IMenu } from "@/models/menu.model";
import { IFeedBack, IOrder } from "@/models/order.model";
import { Card, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

interface IProps {
  orders: IOrder[];
}

interface IDataSource {
  key: number;
  invoice: string;
  customerName: string;
  customerPhoneNumber: string;
  orderDate: string;
  shippingDate: string;
  status: string;
  totalPrice: number;
  menus?: IMenu[];
  customer?: ICustomer;
}

const OrderRecordsCard = (props: IProps) => {
  const { orders = [] } = props;

  const dataSource: IDataSource[] = orders
    .map((order, index) => {
      return {
        key: index,
        invoice: order.invoice,
        customerName: order.customer.name,
        customerPhoneNumber: order.customer.phoneNumber,
        orderDate: order.orderDate,
        shippingDate: order.shipmentDate,
        status: order.extraInformation.feedback.toLowerCase() || "no processed",
        totalPrice: order.payment.totalPrice,
        menus: order.menu,
        customer: order.customer,
      };
    })
    .sort((a, b) => dayjs(b.orderDate).diff(dayjs(a.orderDate)));

  const menuToString = (menu: IMenu) => {
    return `${menu.name} (${menu.quantity})`;
  };

  const columns: ColumnsType<IDataSource> = [
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      filters: Array.from(new Set(dataSource.map((data) => data.invoice))).map(
        (invoice) => {
          return {
            text: invoice,
            value: invoice,
          };
        },
      ),
      filterSearch: true,
      onFilter: (value, record) => record.invoice.startsWith(value as string),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      filters: Array.from(
        new Set(dataSource.map((data) => data.customerName)),
      ).map((name) => {
        return {
          text: name,
          value: name,
        };
      }),
      filterSearch: true,
      onFilter: (value, record) =>
        record.customerName.startsWith(value as string),
    },
    {
      title: "Customer Phone Number",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Shipping Date",
      dataIndex: "shippingDate",
      key: "shippingDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        switch (status) {
          case IFeedBack.DONE:
            color = "success";
            break;
          case IFeedBack.PAID:
            color = "processing";
            break;
          case IFeedBack.DELIVERED:
            color = "warning";
            break;
          case IFeedBack.CANCELED:
            color = "error";
            break;
          case IFeedBack.BAKING:
            color = "cyan";
            break;
          case IFeedBack.NOSTATUS:
            color = "default";
            break;
          default:
            color = "default";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: Array.from(new Set(dataSource.map((data) => data.status))).map(
        (feedback) => {
          return {
            text: feedback.toLocaleLowerCase() || "no processed",
            value: feedback.toLocaleLowerCase() || "no processed",
          };
        },
      ),
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value as string),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];
  return (
    <Card title="Invoices" size="small">
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          pageSize: 10,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <Typography.Text style={{ marginLeft: 6 }}>
                <b>Order:</b>{" "}
                {record.menus?.map((menu) => menuToString(menu)).join(", ")}
              </Typography.Text>
            </>
          ),
        }}
      />
    </Card>
  );
};

export default OrderRecordsCard;
