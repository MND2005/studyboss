import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/components/AuthProvider';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Study Dashboard",
  description: 'A modern dashboard to track study progress and stay motivated.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-body antialiased`} suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 h-full w-full bg-black">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_farthest-corner_at_100%_0,#fca5a533,transparent_50%),radial-gradient(circle_farthest-corner_at_0_100%,#7dd3fc33,transparent_50%)]"></div>
        </div>
        <AuthProvider>
            <div className="container mx-auto px-4 md:px-8 mt-4">
              {children}
            </div>
        </AuthProvider>
        <Toaster />
        <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
          <p>Powered By Jeewana</p>
        </footer>
      </body>
    </html>
  );
}
