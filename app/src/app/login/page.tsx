"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { Button, Card, Space, Spin, message } from "antd";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { login } from "@/services/auth.service";
import { setToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

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

  return (
    <div className={styles.login}>
      <Spin spinning={isLoading}>
        <div className={styles.container}>
          <Card bordered={false} size="small" style={{ width: "100%" }}>
            <Button
              onClick={() => handleLogin()}
              type="primary"
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <FaGoogle style={{ margin: "auto" }} />
              <span style={{ paddingLeft: "1rem" }}>Sign in with Google</span>
            </Button>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default Login;
