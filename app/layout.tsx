import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CryptoProvider from "./Cryptoprovider"; 
import Navbar from "./_components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Decentralized Photo Album ",
  description: "A Web3 photo album using Blockchain and IPFS.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CryptoProvider>
          <Navbar/>
          {children}
        </CryptoProvider>
      </body>
    </html>
  );
}
