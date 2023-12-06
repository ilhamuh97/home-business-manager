import { Card, Radio, RadioChangeEvent } from "antd";
import React, { useState } from "react";
import MyChart from "@/app/components/shared/MyChart/MyChart";
import moment from "moment";
import { IOrder } from "@/app/models/order.model";

interface IProps {
  data: IOrder[];
}

interface IRevenueData {
  name: string;
  data: number[];
}

enum RevenuDateRange {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUALLY = "annually",
}

const RevenueCard = (props: IProps) => {
  const [selectedDateRange, setSelectedDateRange] = useState<RevenuDateRange>(
    RevenuDateRange.MONTHLY,
  );

  const revenueData = () => {
    const thisYear = moment().startOf("year");
    let resultArray: IRevenueData[] = [];
    const data = props.data.filter(
      (order) => order.extraInformation.feedback === "done",
    );

    for (
      let beginYear = thisYear.clone().subtract(1, "year");
      beginYear.isSameOrBefore(thisYear);
      beginYear.add(1, "year")
    ) {
      const yearData = [];
      for (
        let date = beginYear.clone();
        date.isSameOrBefore(beginYear.clone().endOf("year"));
        date.add(1, "month")
      ) {
        const seriesDataCurrYear = data.reduce((count, order) => {
          const priceInK = order.payment.totalPrice / 1000;
          const orderDate = moment(order.shipmentDate);
          if (orderDate.isSame(date, "month")) {
            return count + priceInK;
          }
          return count;
        }, 0);
        yearData.push(seriesDataCurrYear);
      }
      resultArray = [
        ...resultArray,
        {
          name: beginYear.isBefore(thisYear, "year")
            ? "Last year"
            : "Current year",
          data: yearData,
        },
      ];
    }

    return resultArray;
  };

  const chartData = {
    series: revenueData(),
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      colors: ["#CED4DC", "#008FFB"],
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

  const handleChange = (e: RadioChangeEvent) => {
    switch (e.target.value) {
      case RevenuDateRange.WEEKLY:
        setSelectedDateRange(RevenuDateRange.WEEKLY);
        break;
      case RevenuDateRange.MONTHLY:
        setSelectedDateRange(RevenuDateRange.MONTHLY);
        break;
      case RevenuDateRange.ANNUALLY:
        setSelectedDateRange(RevenuDateRange.ANNUALLY);
        break;
    }
  };

  const getMyChart = (selectedDateRange: RevenuDateRange) => {
    switch (selectedDateRange) {
      case RevenuDateRange.WEEKLY:
        return (
          <MyChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={300}
            width={"100%"}
          />
        );
      case RevenuDateRange.MONTHLY:
        return (
          <MyChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={300}
            width={"100%"}
          />
        );
      case RevenuDateRange.ANNUALLY:
        return (
          <MyChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={300}
            width={"100%"}
          />
        );
    }
  };

  return (
    <Card title="Revenue report in (K)" size="small">
      <Radio.Group
        style={{ marginBottom: 8 }}
        defaultValue={selectedDateRange}
        size="small"
        onChange={handleChange}
      >
        <Radio.Button value="weekly">Weekly</Radio.Button>
        <Radio.Button value="monthly">Monthly</Radio.Button>
        <Radio.Button value="annually">Annually</Radio.Button>
      </Radio.Group>
      {getMyChart(selectedDateRange)}
    </Card>
  );
};

export default RevenueCard;
