import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { ZonosLayoutSetup } from "components/zonos/ZonosLayoutSetup";
import { GeistSans } from "geist/font/sans";
import { baseUrl } from "lib/utils";
import { getCart } from "lib/zonos";
import Script from "next/script";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { NEXT_PUBLIC_SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: NEXT_PUBLIC_SITE_NAME!,
    template: `%s | ${NEXT_PUBLIC_SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

const ZONOS_CDN_URL = process.env.NEXT_PUBLIC_ZONOS_CDN_URL;

// Generate timestamp once outside the component
const timestamp = Date.now();

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Script
          src={`${ZONOS_CDN_URL}/dist/scripts/loadZonos.js?timestamp=${timestamp}`}
          strategy="beforeInteractive"
        />
        <ZonosLayoutSetup>
          <CartProvider cartPromise={cart}>
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
            </main>
          </CartProvider>
        </ZonosLayoutSetup>
      </body>
    </html>
  );
}
