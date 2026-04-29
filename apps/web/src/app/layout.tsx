import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import Providers from "@/components/providers";
import { cn } from "@prosopopeia/ui/lib/utils";
import "../index.css";
import { Header } from "./header";

const outfitHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "prosopopeia",
  description: "prosopopeia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, outfitHeading.variable)}
    >
      <body className={`antialiased pt-28`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
