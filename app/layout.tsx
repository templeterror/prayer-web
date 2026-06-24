import type { Metadata } from "next";
import { Lora, Raleway } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Iqama — Guard your prayer from the scroll",
  description:
    "Iqama blocks distracting apps during the five daily prayer windows until you've prayed. iOS. Join the waitlist.",
  openGraph: {
    title: "Iqama — Guard your prayer from the scroll",
    description:
      "Your phone locks the distractions during each salah, and opens again once you've prayed. Join the waitlist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="font-sans text-cream antialiased selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
