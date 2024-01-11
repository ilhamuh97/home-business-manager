import { IMenu } from "@/models/menu.model";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

interface IProps {
  menu: IMenu[];
}

interface IDataSource {
  key: string;
  name: string;
  category: string;
  normalPrice: number;
  cafePrice: number;
}

const MenuList = (props: IProps) => {
  const { menu = [] } = props;

  const dataSource: IDataSource[] = menu.map((m: IMenu) => {
    return {
      key: m.key,
      name: m.name,
      category: m.category || "",
      normalPrice: m.normalPrice || 0,
      cafePrice: m.cafePrice || 0,
    };
  });

  const columns: ColumnsType<IDataSource> = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Normal Price",
      dataIndex: "normalPrice",
      key: "normalPrice",
    },
    {
      title: "Cafe Price",
      dataIndex: "cafePrice",
      key: "cafePrice",
    },
  ];

  return (
    <Card title="Menu list">
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          pageSize: 10,
        }}
      ></Table>
    </Card>
  );
};

export default MenuList;
