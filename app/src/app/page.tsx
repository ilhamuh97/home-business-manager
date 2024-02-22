"use client";

import { Button, Layout, Typography } from "antd";
import ApexChartsLogo from "../assets/apexcharts.png";
import WhatsappWebJSLogo from "../assets/whatsappWebJs.png";
import NextJSLogo from "../assets/nextJSLogo.svg";
import Logo from "../assets/VizConnect.png";
import { ArrowRightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function Home() {
  const { Header, Content, Footer } = Layout;
  const { Title, Text } = Typography;
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <main className={styles.main}>
      <div className={styles.vizConnectlogo}>
        <Image src={Logo} alt="VizConnect logo" />
      </div>
      <Content className={styles.content}>
        <Typography className={styles.article}>
          <Title>VizConnect</Title>
          <Text>
            A web-based dashboard application designed to visually represent
            data from Google Sheets, which is ideal for small to medium-sized
            businesses.
          </Text>
        </Typography>
        <div className={styles.logosWrapper}>
          <a
            className={styles.logo}
            href="https://ant.design/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={ApexChartsLogo} alt="Ant-Design logo" />
          </a>
          <a
            className={styles.logo}
            href="https://wwebjs.dev/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={WhatsappWebJSLogo} alt="Whatsapp-Web.js logo" />
          </a>
          <a
            className={styles.logo}
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={NextJSLogo} alt="NextJS logo" />
          </a>
        </div>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          shape="round"
          size="large"
          onClick={handleClick}
        >
          Login page
        </Button>
      </Content>
      <Footer className={styles.footer}>
        © Copyright {new Date().getFullYear()} Ilhamuh97
      </Footer>
    </main>
  );
}
