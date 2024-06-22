import { IMenu } from "@/models/menu.model";
import { IOrder, IFeedBack } from "@/models/order.model";
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
  shippingDate: string;
  status: string;
  menus?: IMenu[];
  customerAddress: string;
}

const OngoingOrdersCard = (props: IProps) => {
  const { orders = [] } = props;
  const ongoingOrders = (orders: IOrder[]) => {
    return orders.filter(
      (order) =>
        order.extraInformation.feedback.toLowerCase() !== IFeedBack.DONE &&
        order.extraInformation.feedback.toLowerCase() !== IFeedBack.CANCELED,
    );
  };

  const dataSource: IDataSource[] = ongoingOrders(orders)
    .map((order, index) => {
      return {
        key: index,
        invoice: order.invoice,
        customerName: order.customer.name,
        shippingDate: order.shipmentDate,
        status: order.extraInformation.feedback.toLowerCase() || "no processed",
        menus: order.menu,
        customerAddress: order.customer.address,
      };
    })
    .sort((a, b) => dayjs(a.shippingDate).diff(dayjs(b.shippingDate)));

  const menuToString = (menu: IMenu) => {
    return `${menu.name} (${menu.quantity})`;
  };

  const dataSourceNumber = (dataSource: IDataSource[]) => {
    const length = dataSource?.length;
    if (!dataSource) {
      return "";
    }

    return `(${length})`;
  };

  const columns: ColumnsType<IDataSource> = [
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      filters: Array.from(
        new Set(dataSource.map((order) => order.customerName)),
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
          case IFeedBack.PAID:
            color = "processing";
            break;
          case IFeedBack.DELIVERED:
            color = "warning";
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
  ];
  return (
    <Card title={`Ongoing orders ${dataSourceNumber(dataSource)}`} size="small">
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          pageSize: 5,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <Typography.Text style={{ marginLeft: 6 }}>
                <b>Address:</b> {`${record.customerAddress}`}
              </Typography.Text>
              <br />
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

export default OngoingOrdersCard;
