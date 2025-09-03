import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { ScrollToTop } from "@/components/ScrollToTop";
import { Providers } from "@/redux/provider";
import { UserLoader } from "@/components/UserLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bandbul - Müzik için her şey",
  description: "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <UserLoader />
            {children}
            
            {/* Fixed Scroll to Top Button - Bottom Right */}
            <ScrollToTop />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
