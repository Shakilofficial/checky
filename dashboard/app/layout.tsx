import Providers from "@/components/providers";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

const rootFontClasses = `${manrope.variable} antialiased bg-background text-foreground`;

export const metadata = {
  title: "Checky Dashboard",
  description: "Elite Task Intelligence & Management Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={rootFontClasses} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
