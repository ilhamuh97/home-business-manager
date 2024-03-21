import MyChart from "@/components/shared/MyChart/MyChart";
import React from "react";

interface IProps {
  series: any;
  categories: any;
}

const MonthlyChart = (props: IProps) => {
  const { series, categories } = props;
  const chartData = {
    series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "11px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      colors: [
        "#FF5733",
        "#33FF57",
        "#3366FF",
        "#FF33E6",
        "#FFD733",
        "#9933FF",
      ],
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
        categories: categories,
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  };

  return (
    <MyChart
      options={chartData.options}
      series={chartData.series}
      type="bar"
      height={300}
      width={"100%"}
    />
  );
};

export default MonthlyChart;
