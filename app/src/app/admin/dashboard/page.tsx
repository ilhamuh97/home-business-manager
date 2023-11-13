"use client";

import { Card, Col, Radio, Row, Table } from "antd";
import StatisticCard from "@/app/components/StatisticCard/StatisticCard";
import MyChart from "@/app/components/MyChart/MyChart";

export default function Home() {
  const chartData = {
    series: [
      {
        name: "Current year",
        data: [31, 41, 35, 51, 49, 51, 65, 71, 81, 88, 75],
      },
      {
        name: "Last year",
        data: [3, 8, 10, 15, 25, 22, 34, 31, 45, 46, 47, 38],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      colors: ["#008FFB", "#CED4DC"],
      stroke: {
        curve: "straight",
      },
      title: {
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Dec",
        ],
      },
    },
  };

  const barData = {
    series: [
      {
        name: "Quantity",
        data: [58, 54, 47, 44, 43, 40],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          horizontal: true,
        },
      },
      xaxis: {
        categories: [
          "Large original",
          "Large peanut",
          "Large chocolate",
          "Matcha bubble tea",
          "Brown sugar bubble tea",
          "Pizza",
        ],
      },
    },
  };

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },

    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <main>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard
            title="Revenue"
            suffix="K"
            value={20100}
            percentage={21}
            dateRange="monthly"
            up
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Orders"
            value={24}
            percentage={11}
            dateRange="monthly"
            up
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Today's order"
            value={2}
            percentage={25}
            dateRange="daily"
            up
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="New Clients"
            value={9}
            percentage={5}
            dateRange="anually"
          />
        </Col>
        <Col span={16}>
          <Card title="Revenue" size="small">
            <Radio.Group style={{ marginBottom: 8 }}>
              <Radio.Button value="top">Anually</Radio.Button>
              <Radio.Button value="left">Monthly</Radio.Button>
            </Radio.Group>
            <MyChart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height={350}
              width={"100%"}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top menus (monthly)" size="small">
            <Radio.Group style={{ marginBottom: 8 }}>
              <Radio.Button value="top">Anually</Radio.Button>
              <Radio.Button value="left">Monthly</Radio.Button>
            </Radio.Group>
            <MyChart
              options={barData.options}
              series={barData.series}
              type="bar"
              height={350}
              width={"100%"}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Last orders" size="small">
            <Table dataSource={dataSource} columns={columns} size="small" />
          </Card>
        </Col>
      </Row>
    </main>
  );
}
