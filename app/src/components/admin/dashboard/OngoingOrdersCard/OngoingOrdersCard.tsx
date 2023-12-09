import { ICustomer } from "@/models/customer.model";
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
  orderDate: string;
  shippingDate: string;
  status: string;
  menus?: IMenu[];
  customer?: ICustomer;
}

const OngoingOrdersCard = (props: IProps) => {
  const { orders = [] } = props;
  const ongoingOrders = (orders: IOrder[]) => {
    return orders.filter(
      (order) =>
        order.extraInformation.feedback !== IFeedBack.DONE &&
        order.extraInformation.feedback !== IFeedBack.CANCELED,
    );
  };

  const dataSource: IDataSource[] = ongoingOrders(orders)
    .map((order, index) => {
      return {
        key: index,
        invoice: order.invoice,
        orderDate: order.orderDate,
        shippingDate: order.shipmentDate, // Assuming you want to use orderDate for both
        status: order.extraInformation.feedback || "No processed",
        menus: order.menu,
        customer: order.customer,
      };
    })
    .sort((a, b) => dayjs(a.orderDate).diff(dayjs(b.orderDate)));

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
          case IFeedBack.PAID:
            color = "processing";
            break;
          case IFeedBack.DELIVERED:
            color = "warning";
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
                {`${record.customer?.name}, ${record.customer?.phoneNumber}`}
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
