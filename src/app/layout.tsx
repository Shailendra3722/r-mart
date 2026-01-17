import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "R Mart | Premium Rural Commerce",
  description: "The best fashion for men, women, and kids.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(inter.variable, "antialiased bg-background text-foreground")}
      >
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
