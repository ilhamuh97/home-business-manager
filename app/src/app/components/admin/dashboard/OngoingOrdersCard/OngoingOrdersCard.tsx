import { IFeedBack, IOrder } from "@/app/models/order.model";
import { Card, Col, Table } from "antd";
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
}

const OngoingOrdersCard = (props: IProps) => {
  const { orders = [] } = props;
  const ongoingOrders = (orders: IOrder[]) => {
    return orders.filter(
      (order) => order.extraInformation.feedback !== IFeedBack.DONE,
    );
  };

  const dataSource: IDataSource[] = ongoingOrders(orders).map(
    (order, index) => {
      return {
        key: index,
        invoice: order.invoice,
        orderDate: order.orderDate,
        shippingDate: order.shipmentDate,
        status: order.extraInformation.feedback || "No processed",
      };
    },
  );

  const dataSourceNumber = (dataSource: IDataSource[]) => {
    const length = dataSource?.length;
    if (!dataSource) {
      return "";
    }

    return `(${length})`;
  };

  const columns = [
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
      title: "Shippment Date",
      dataIndex: "shippingDate",
      key: "shippingDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      />
    </Card>
  );
};

export default OngoingOrdersCard;
