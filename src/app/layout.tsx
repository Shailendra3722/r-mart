import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "R Mart | Premium Rural Commerce",
  description: "The best fashion for men, women, and kids. Shop trending clothes, accessories & more at unbeatable prices.",
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
        className={clsx(inter.variable, "antialiased bg-background text-foreground transition-colors duration-300")}
      >
        <ThemeProvider>
          <AuthProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
