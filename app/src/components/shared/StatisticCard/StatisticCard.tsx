import React from "react";
import { Button, Card, Statistic, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./StatisticCard.module.scss";

type StatisticCardProps = {
  title?: string;
  value?: number;
  suffix?: string;
  percentage?: number;
  dateRange?: string;
  redirect?: string;
  valueStyle?: React.CSSProperties;
  reverse?: boolean;
};

const StatisticCard = ({
  title,
  value,
  suffix,
  percentage = 0,
  dateRange,
  redirect = "",
  valueStyle,
  reverse = false,
}: StatisticCardProps) => {
  const getStatus = (percentage: number, reverse: boolean = false) => {
    if (percentage === 0) {
      return "straight";
    } else if (percentage > 0) {
      return reverse ? "down" : "up";
    } else {
      return reverse ? "up" : "down";
    }
  };

  const getStatusIcon = (percentage: number, reverse: boolean = false) => {
    if (percentage === 0) {
      return "";
    } else if (percentage > 0) {
      return reverse ? (
        <ArrowDownOutlined className={styles.down} />
      ) : (
        <ArrowUpOutlined className={styles.up} />
      );
    } else {
      return reverse ? (
        <ArrowUpOutlined className={styles.up} />
      ) : (
        <ArrowDownOutlined className={styles.down} />
      );
    }
  };

  const getDateRangeString = (dateRange: string = "monthly") => {
    switch (dateRange) {
      case "daily":
        return "Since yesterday";
      case "monthly":
        return "Since last month";
      case "annually":
        return "Since last year";
      default:
        return "Since last month";
    }
  };

  return (
    <Card
      title={title}
      className={styles.statisticCard}
      size="small"
      extra={
        redirect ? (
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            type="link"
            href={redirect}
          />
        ) : null
      }
    >
      <div className={styles.content}>
        <Statistic value={value} suffix={suffix} valueStyle={valueStyle} />
        <div className={styles.detail}>
          {getStatusIcon(percentage, reverse)}{" "}
          <Typography.Text
            className={`${styles[getStatus(percentage, reverse)]} ${
              styles.small
            }`}
          >
            {Math.abs(percentage || 0)}%
          </Typography.Text>{" "}
          <Typography.Text
            className={`${styles.dateRange} ${styles.small}`}
            type="secondary"
          >
            {getDateRangeString(dateRange)}
          </Typography.Text>
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard;
