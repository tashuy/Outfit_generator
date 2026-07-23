import './globals.css';
import Navbar from '@/components/Navbar';
import ClientInitializer from '@/components/ClientInitializer';

export const metadata = {
  title: 'DressGen.AI - Your AI Personal Stylist',
  description: 'Tell us where you are going, your budget, and style preference—we will dress you from head to toe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <ClientInitializer />
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="glass-panel border-t border-white/5 py-8 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2 mb-4 md:mb-0">
              <span className="text-xs text-slate-500">Goa Trip</span>
              <span className="text-xs text-slate-500">Date Night</span>
              <span className="text-xs text-slate-500">Job Interviews</span>
              <span className="text-xs text-slate-500">Weddings</span>
            </div>
            <div className="md:order-1">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} DressGen.AI. Outfitting you from head to toe. Powered by Gemini.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
