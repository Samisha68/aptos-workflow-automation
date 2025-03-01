import { Inter } from 'next/font/google';
import './global.css'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">AptoWorkflow</Link>
            <nav className="space-x-4">
              <Link href="/workflows" className="text-gray-600 hover:text-blue-600">Workflows</Link>
              <Link href="/workflows/create" className="text-gray-600 hover:text-blue-600">Create</Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            AptoWorkflow - Blockchain Automation Platform for Aptos
          </div>
        </footer>
      </body>
    </html>
  );
}