import { Card, Col, Row, Statistic } from "antd";
import React from "react";
import dayjs, { OpUnitType } from "dayjs";
import StatisticCard from "@/components/shared/StatisticCard/StatisticCard";
import { IFeedBack, IOrder } from "@/models/order.model";
import { getFilteredOrder, getOrdersNumberOfMonth } from "@/utils/order";
import styles from "../../../shared/StatisticCard/StatisticCard.module.scss";
import { getPercentageIncrease } from "@/utils/general";

interface IProps {
  orders: IOrder[];
}

const StatisticsCards = (props: IProps) => {
  const { orders } = props;
  const doneOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.DONE,
  );
  const canceledOrders = orders.filter(
    (order) => order.extraInformation.feedback === IFeedBack.CANCELED,
  );
  const inProgressOrders = orders.filter(
    (order) =>
      order.extraInformation.feedback !== IFeedBack.DONE &&
      order.extraInformation.feedback !== IFeedBack.CANCELED,
  );

  const GRANULARITY: OpUnitType = "month";
  const CURR_DATE = dayjs().startOf(GRANULARITY);
  const OLD_DATE = CURR_DATE.clone().subtract(1, GRANULARITY);
  const totalOrder = getOrdersNumberOfMonth(orders, CURR_DATE, GRANULARITY);
  const totalOrderLast = getOrdersNumberOfMonth(orders, OLD_DATE, GRANULARITY);
  const totalDoneOrder = getOrdersNumberOfMonth(
    doneOrders,
    CURR_DATE,
    GRANULARITY,
  );
  const totalDoneOrderLast = getOrdersNumberOfMonth(
    doneOrders,
    OLD_DATE,
    GRANULARITY,
  );
  const totalInprogressOrder = getOrdersNumberOfMonth(
    inProgressOrders,
    CURR_DATE,
    GRANULARITY,
  );
  const totalCanceledOrder = getOrdersNumberOfMonth(
    canceledOrders,
    CURR_DATE,
    GRANULARITY,
  );

  return (
    <>
      <Col span={8}>
        <StatisticCard
          title="Total Invoices"
          value={totalOrder}
          percentage={getPercentageIncrease(totalOrder, totalOrderLast)}
          dateRange="monthly"
        />
      </Col>
      <Col span={8}>
        <StatisticCard
          title="Completed"
          value={totalDoneOrder}
          percentage={getPercentageIncrease(totalDoneOrder, totalDoneOrderLast)}
          valueStyle={{
            color: "#3f8600",
          }}
          dateRange="monthly"
        />
      </Col>
      <Col span={8}>
        <Card
          className={styles.statisticCard}
          style={{ height: "100%" }}
          size="small"
          title={`Other status`}
        >
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Statistic
                title="Ongoing"
                value={totalInprogressOrder}
                valueStyle={{ color: "#0958d9" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Canceled"
                value={totalCanceledOrder}
                valueStyle={{ color: "#cf1322" }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default StatisticsCards;
