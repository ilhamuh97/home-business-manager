import MyChart from "@/components/shared/MyChart/MyChart";
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
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories,
      },
    },
  };

  return (
    <MyChart
      options={chartData.options}
      series={chartData.series}
      type="line"
      height={300}
      width={"100%"}
    />
  );
};

export default WeeklyChart;
