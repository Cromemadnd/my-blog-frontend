import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/layout/app-shell"
import { LeftSidebarContent } from "@/components/layout/left-sidebar"
import { TableOfContents } from "@/components/layout/toc"
import { LayoutProvider } from "@/components/layout-context"
import { getAllPosts } from "@/lib/posts"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cromemadnd's Blog",
  description: "A minimalist industrial style blog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPosts = await getAllPosts();

  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutProvider>
            <AppShell
              leftSidebar={<LeftSidebarContent />}
              rightSidebar={<TableOfContents />}
              posts={allPosts}
            >
              {children}
            </AppShell>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
