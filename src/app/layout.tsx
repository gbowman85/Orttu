import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "../providers/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Orttu",
  description: "An automation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Wrap children in ConvexClientProvider to allow using Convex in all children */}
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
