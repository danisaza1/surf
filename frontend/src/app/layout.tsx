import type { Metadata } from "next";
import "./globals.css";
import { Original_Surfer } from "next/font/google";

// Crea la clase de la fuente
const originalSurfer = Original_Surfer({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Waveo",
  description: "Préparez votre session de surf parfaite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={originalSurfer.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
