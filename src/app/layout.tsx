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
  title: "VayuKavach V2 – Smart Air Protection System",
  description: "Real-time air quality monitoring dashboard (Outdoor vs Purified) with performance insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col vk-bg">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          {/* Top shell (older-site style: sticky, glassy) */}
          <div className="sticky top-0 z-20 -mx-5 sm:-mx-6">
            <div className="border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
              <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                      <span className="text-sm font-semibold text-emerald-200">VK</span>
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm font-semibold">VayuKavach V2</div>
                      <div className="text-xs text-white/55">Smart Air Protection</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="vk-pill rounded-full px-2.5 py-1 text-[11px] font-medium">LIVE DASHBOARD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 py-10">{children}</main>

          <footer className="border-t border-white/10 py-8 text-xs text-white/50">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} VayuKavach Project</div>
              <div className="font-mono">/api/ingest • /api/latest</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
