import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: 'Beeing Rich - Plataforma Imobiliária Premium',
    template: '%s | Beeing Rich'
  },
  description: 'Plataforma completa de gestão imobiliária com análise de investimentos, portfolio de imóveis e insights de mercado',
  keywords: ['imóveis', 'investimento imobiliário', 'gestão de propriedades', 'mercado imobiliário', 'análise de investimentos'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
