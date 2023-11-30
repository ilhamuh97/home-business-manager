import { Card, Radio } from "antd";
import React from "react";
import MyChart from "@/app/components/shared/MyChart/MyChart";
import moment from "moment";

interface IProps {
  data: any[];
}

const RevenueCard = (props: IProps) => {
  const revenueData = () => {
    const thisYear = moment().startOf("year");
    let resultArray: any[] = [];
    const data = props.data; // Assuming orders is defined somewhere

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

  return (
    <Card title="Revenue in (K)" size="small">
      <Radio.Group style={{ marginBottom: 8 }} defaultValue={"monthly"}>
        <Radio.Button value="monthly">Monthly</Radio.Button>
        <Radio.Button value="anually">Anually</Radio.Button>
      </Radio.Group>
      <MyChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={200}
        width={"100%"}
      />
    </Card>
  );
};

export default RevenueCard;
