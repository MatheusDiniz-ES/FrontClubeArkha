"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";

// const inter = Inter({ subsets: ["latin"] });

const queryClientProvider = new QueryClient();

import localFont from "next/font/local";

const Founders = localFont({
  src: "../public/fonts/Founders_Grotesk/FoundersGrotesk-Regular.otf",
  variable: "--font-Founders", // se quiser usar com Tailwind
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`h-full min-h-screen`}
      lang="pt-br"
      suppressHydrationWarning={true}
    >
      <head>
        <title>Paínel Adm</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Plataforma para gerenciamento de clientes e consultorias"
        />
        <meta name="author" content="EvolutionSoft" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${Founders.className} h-[100vh] flex bg-gray-100 dark:bg-gray-800`}
      >
        <QueryClientProvider client={queryClientProvider}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
