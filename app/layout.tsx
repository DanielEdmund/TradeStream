import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TradeStream — Demo / Simulated Trading Terminal",
    template: "%s · TradeStream (Demo)",
  },
  description:
    "TradeStream is a frontend prototype of a professional trading terminal for Nigerian retail investors. Every price, order, balance and chart is local mock data — demo / simulated trading only.",
  keywords: ["demo", "simulated", "trading terminal", "prototype", "NGX", "mock"],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-950 text-plat antialiased">
        {children}
      </body>
    </html>
  );
}
