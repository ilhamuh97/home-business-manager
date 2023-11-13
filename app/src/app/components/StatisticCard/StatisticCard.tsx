import React from "react";
import { Card, Statistic, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import styles from "./StatisticCard.module.scss";

type StatisticCardProps = {
  title?: string;
  value?: number;
  suffix?: string;
  percentage?: number;
  up?: boolean;
  dateRange?: string;
};

const StatisticCard = ({
  title,
  value,
  suffix,
  percentage,
  up,
  dateRange,
}: StatisticCardProps) => {
  const getDateRangeString = (dateRange: string = "monthly") => {
    switch (dateRange) {
      case "daily":
        return "Since yesterday";
      case "monthly":
        return "Since last month";
      case "anually":
        return "Since last year";
      default:
        return "Since last month";
    }
  };

  return (
    <Card className={styles.statisticCard} bodyStyle={{ padding: "1rem" }}>
      <div className={styles.content}>
        <Statistic title={title?.toUpperCase()} value={value} suffix={suffix} />
        <div className={styles.detail}>
          {up ? (
            <ArrowUpOutlined className={styles.up} />
          ) : (
            <ArrowDownOutlined className={styles.down} />
          )}{" "}
          <Typography.Text className={up ? styles.up : styles.down}>
            {percentage}%
          </Typography.Text>{" "}
          <Typography.Text className={styles.dateRange}>
            {getDateRangeString(dateRange)}
          </Typography.Text>
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard;
