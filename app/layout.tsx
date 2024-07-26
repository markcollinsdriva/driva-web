import { Metadata } from 'next'
import Providers from './providers'

import './globals.css'


export const metadata: Metadata = {
  title: 'Driva',
  description: 'Driva',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
