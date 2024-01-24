import StatisticCard from "@/components/shared/StatisticCard/StatisticCard";
import { IMenu } from "@/models/menu.model";
import { IOrder } from "@/models/order.model";
import { getPercentageIncrease } from "@/utils/general";
import { Col } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface IProps {
  menu: IMenu[];
  orders: IOrder[];
}

const StatisticsCards = (props: IProps) => {
  const { menu = [], orders = [] } = props;
  const [totalMenus, setTotalMenus] = useState(0);
  const [overallAverage, setOverallAverage] = useState(0);
  const [menuOrderedCurrMonth, setMenuOrderedCurrMonth] = useState(0);
  const [menuOrderedLastMonth, setMenuOrderedLastMonth] = useState(0);

  useEffect(() => {
    const calculateAverageMenusPerMonth = (invoices: IOrder[]): void => {
      const currentDate = dayjs();
      const lastMonth = dayjs().subtract(1, "month");
      const monthlyMenuCounts: any = {};

      for (const invoice of invoices) {
        const orderMonth = dayjs(invoice.orderDate).format("MMMM YYYY");

        if (!monthlyMenuCounts[orderMonth]) {
          monthlyMenuCounts[orderMonth] = {
            totalMenus: 0,
          };
        }

        for (const menuItem of invoice.menu) {
          monthlyMenuCounts[orderMonth].totalMenus += menuItem.quantity;
        }
      }

      let totalMenus = 0;

      for (const month in monthlyMenuCounts) {
        const { totalMenus: monthlyTotalMenus } = monthlyMenuCounts[month];
        totalMenus += monthlyTotalMenus;
      }

      const overallAverage =
        totalMenus / Object.values(monthlyMenuCounts).length || 0;

      setOverallAverage(overallAverage);
      setTotalMenus(totalMenus);
      setMenuOrderedCurrMonth(
        monthlyMenuCounts[currentDate.format("MMMM YYYY")]?.totalMenus || 0,
      );
      setMenuOrderedLastMonth(
        monthlyMenuCounts[lastMonth.format("MMMM YYYY")]?.totalMenus || 0,
      );
    };

    calculateAverageMenusPerMonth(orders);
  }, [menu, orders]);

  return (
    <>
      <Col span={6}>
        <StatisticCard
          title="Total menu ordered"
          value={totalMenus}
          hidePercentage={true}
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Menu ordered"
          value={menuOrderedCurrMonth}
          percentage={getPercentageIncrease(
            menuOrderedCurrMonth,
            menuOrderedLastMonth,
          )}
          dateRange="monthly"
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Monthly average"
          value={overallAverage}
          hidePercentage={true}
        />
      </Col>
      <Col span={6}>
        <StatisticCard
          title="Menu list"
          value={menu.length}
          hidePercentage={true}
        />
      </Col>
    </>
  );
};

export default StatisticsCards;
