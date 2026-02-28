import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hireco AI - Revolutionize Your Hiring Process with AI-Powered Solutions",
  description: "Hireco AI is an innovative platform that leverages artificial intelligence to streamline and enhance the hiring process. Our cutting-edge solutions help businesses identify top talent quickly and efficiently, saving time and resources while improving the quality of hires. With Hireco AI, you can revolutionize your recruitment strategy and stay ahead in the competitive job market.",
  verification: {
    google: 'google-site-verification=DrNpKO6zEaaTWxUczAc8ely5fnOWBYrIySJDRmcYI08'
  }
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
        {children}
      </body>
    </html>
  );
}
