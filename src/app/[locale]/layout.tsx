import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing'
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from './components/Navbar/navbar';
import Footer from './components/Footer/Footer';
import { Metadata } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';
// import { LoadingProvider } from '@/components/LoadingProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'F3S Software',
  description: 'Simplified soft tech',
  openGraph: {
    title: 'F3S Software',
    description: 'Simplified soft tech',
    url: 'https://www.f3ssoftware.com',
    siteName: 'F3S Software',
    images: [
      {
        url: 'https://www.f3ssoftware.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'F3S Software Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@f3ssoftware',
    title: 'F3S Software',
    description: 'Simplified soft tech',
    images: ['https://www.f3ssoftware.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.f3ssoftware.com',
    languages: {
      'en-US': 'https://www.f3ssoftware.com/en',
      'pt-BR': 'https://www.f3ssoftware.com/pt',
      'es-SP': 'https://www.f3ssoftware.com/es',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  keywords: [
    'software development',
    'F3S Software',
    'technology for niche markets',
    'niche tech solutions',
    'tech consultancy',
    'software engineering',
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'F3S Software',
  url: 'https://www.f3ssoftware.com',
  logo: 'https://www.f3ssoftware.com/logo.jpg',
  sameAs: [
    'https://www.facebook.com/f3ssoftware',
    'https://www.linkedin.com/company/f3s-software/',
    'https://www.instagram.com/f3ssoftware/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-61-98149-4249',
    contactType: 'Customer Support',
    areaServed: 'BR',
    availableLanguage: ['Portuguese', 'English', 'Spanish'],
  },
};

export default async function LocaleLayout({
  children,
  params: asyncParams
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await asyncParams;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>

      {/* Adding structured data in JSON-LD format to help search engines understand and display richer information about our organization in search results.
      Schema.org,
      */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body className={inter.className}>
        <SessionProvider>
          {/* <LoadingProvider> */}
            <NextIntlClientProvider messages={messages}>
              <Navbar />
              <main className="relative overflow-hidden">{children}</main>
              <Footer />
            </NextIntlClientProvider>
          {/* </LoadingProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}