import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer"; // REQUIREMENT: footer was missing
import { Toaster } from "react-hot-toast";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

// REQUIREMENT: proper title and description instead of the create-next-app defaults
export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn" // REQUIREMENT: the site is in Bangla
      data-theme="light"
      // REQUIREMENT: scroll-smooth makes the hero CTA scroll smoothly to #সব-পণ্য
      className={`${hindSiliguri.className} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f0f5f0]">
        {/* REQUIREMENT: was <main>. Home already has its own <main>, and nested <main> is invalid HTML.
            flex-1 pushes the footer to the bottom on short pages. */}
        <div className="flex-1">
          <Header />
          <Marquee />
          {children}
        </div>
        <Footer /> {/* REQUIREMENT: footer on every page */}
        <Toaster />
      </body>
    </html>
  );
}