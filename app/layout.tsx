import { Poppins, Barlow } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import HydratedAuth from "@/components/AuthLoader";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AuthGuardProvider } from "@/context/AuthGuardContext";
import { APP_BRANDING } from "@/lib/constants/assets";
import { ThemeProvider } from "@/components/ThemeProvider";

// app/layout.tsx
export const metadata = {
  title: {
    default: APP_BRANDING,
    template: `${APP_BRANDING} - %s`,
  },
  description: "Travel platform for discovering and managing trips",
};


const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="">
      <body className={`${poppins.variable} ${barlow.variable} font-poppins antialiased`}>
        <ReduxProvider>
          <HydratedAuth>
            <AuthGuardProvider>
              <ThemeProvider>
                {children}
                <Analytics />
                <SpeedInsights />
                <Toaster />
              </ThemeProvider>
            </AuthGuardProvider>
          </HydratedAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
