import MyChart from "@/app/components/shared/MyChart/MyChart";
import React from "react";

interface IProps {
  series: any;
  categories: any;
}

const WeeklyChart = (props: IProps) => {
  const { series, categories } = props;

  const chartData = {
    series,
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      colors: ["#008FFB"],
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
        categories,
        tickAmount: 10,
      },
    },
  };

  return (
    <MyChart
      options={chartData.options}
      series={chartData.series}
      type="area"
      height={300}
      width={"100%"}
    />
  );
};

export default WeeklyChart;
