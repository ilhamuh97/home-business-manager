"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Button, Card, Flex, Spin, message } from "antd";
import React, { useState } from "react";
import { login } from "@/services/auth.service";
import { setToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { GoogleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import Logo from "../../assets/VizConnect.png";
import styles from "./page.module.scss";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const responseMessage = async (codeResponse: any) => {
    setIsLoading(true);
    try {
      const loginResponse = await login(codeResponse.access_token);
      const loginData = await loginResponse.json();

      if (loginData.status === "error") {
        message.error("Login failed");
      }

      if (loginData.status === "success") {
        setToken({ accessToken: codeResponse.access_token });
        message.success("Login succeeded");
        router.push("admin/overview");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = useGoogleLogin({
    onSuccess: responseMessage,
    onError: (error) => console.error("Login failed:", error),
  });

  const handleBackToMain = () => {
    router.push("/");
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles.login}>
        <div className={styles.vizConnectlogo}>
          <Image src={Logo} alt="VizConnect logo" />
        </div>
        <div className={styles.container}>
          <Card bordered={false} style={{ width: "100%" }}>
            <Flex gap={16} vertical>
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleLogin()}
                type="primary"
              >
                Sign in with Google
              </Button>
              <Button
                onClick={handleBackToMain}
                type="primary"
                icon={<ArrowLeftOutlined />}
                ghost
              >
                Back to main
              </Button>
            </Flex>
          </Card>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
