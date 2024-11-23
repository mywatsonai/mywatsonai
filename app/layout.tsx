import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mywatson",
  description: "",
};

const titi = Titillium_Web({
  subsets: ["latin"],
  style: "normal",
  weight: ["200", "300", "400", "600", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={titi.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
