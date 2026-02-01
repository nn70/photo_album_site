import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "時光小屋",
  description: "小赫與寧寧的時光小屋 Photo Album",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.jpg",
    apple: "/icons/icon.jpg",
  },
  appleWebApp: {
    capable: true,
    title: "時光小屋",
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
