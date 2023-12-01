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
};

const StatisticCard = ({
  title,
  value,
  suffix,
  percentage = 0,
  dateRange,
  redirect = "",
}: StatisticCardProps) => {
  const getStatus = (percentage: number) => {
    if (percentage === 0) {
      return "straight";
    } else if (percentage > 0) {
      return "up";
    } else {
      return "down";
    }
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage === 0) {
      return "";
    } else if (percentage > 0) {
      return <ArrowUpOutlined className={styles.up} />;
    } else {
      return <ArrowDownOutlined className={styles.down} />;
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

  function handleClick(event: any): void {
    console.log(event);
  }

  return (
    <Card
      title={title}
      className={styles.statisticCard}
      bodyStyle={{ padding: "1rem" }}
      size="small"
      extra={
        redirect ? (
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            type="link"
            href={redirect}
            onClick={handleClick}
          />
        ) : null
      }
    >
      <div className={styles.content}>
        <Statistic value={value} suffix={suffix} />
        <div className={styles.detail}>
          {getStatusIcon(percentage)}{" "}
          <Typography.Text
            className={`${styles[getStatus(percentage)]} ${styles.small}`}
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
