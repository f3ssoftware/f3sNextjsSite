import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar/navbar";
import Footer from "./components/Footer/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from 'i18next';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "F3S Software",
  description: "Simplified soft tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          <Navbar />
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </I18nextProvider>
      </body>
    </html>
  );
}
