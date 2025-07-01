import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/components/AuthProvider';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Jeewana's Study Dashboard",
  description: 'A ninja-themed study dashboard to track progress and stay motivated.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
            <div className="container mx-auto px-4 md:px-8 mt-20">
              {children}
            </div>
        </AuthProvider>
        <Toaster />
        <footer className="text-center p-4 mt-8 bg-black/50 text-white">
          <p>Powered By</p>
          <Image src="/mndlogo.png" alt="Footer Logo" width={100} height={50} className="mx-auto mt-2" data-ai-hint="logo company"/>
        </footer>
      </body>
    </html>
  );
}
