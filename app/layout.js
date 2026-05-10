import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const syne = Syne({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "FarmOps - Database Manager",
  description: "Professional MS SQL Server Database Management Interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}