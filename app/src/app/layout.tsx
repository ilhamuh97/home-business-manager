import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles//globals.scss";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
