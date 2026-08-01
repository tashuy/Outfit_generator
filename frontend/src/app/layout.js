import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientInitializer from '@/components/ClientInitializer';
import Script from 'next/script';

export const metadata = {
  title: 'Vyvora — Discover Your Next Look',
  description: 'Discover curated outfits for every destination, occasion and style. Watch outfit videos and shop the complete look.',
  keywords: ['fashion', 'outfits', 'travel outfits', 'vacation outfits', 'styling inspiration', 'Vyvora'],
  openGraph: {
    title: 'Vyvora — Discover Your Next Look',
    description: 'Discover curated outfits for every destination, occasion and style. Watch outfit videos and shop the complete look.',
    siteName: 'Vyvora',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <ClientInitializer />
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
