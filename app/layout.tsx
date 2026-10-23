import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchModal from "@/components/SearchModal";
import { ModalProvider } from "@/components/interactive";
import site from "@/data/site.json";
import { textMap } from "@/lib/content";
import { LANG_INIT_SCRIPT } from "@/lib/lang";
import "./globals.css";

const { site_name, title_suffix, description } = site.meta[0];
const txt = textMap(site.texts);

export const metadata: Metadata = {
  title: { default: site_name, template: `%s — ${title_suffix}` },
  description,
  icons: {
    icon: "/assets/img/brand/nazrul-academy-favicon-v2.png",
    shortcut: "/assets/img/brand/nazrul-academy-favicon-v2.png",
  },
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-lang-active="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link href={FONTS} rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: LANG_INIT_SCRIPT }} />
      </head>
      <body className="bg-cream-50 text-charcoal-900">
        <ModalProvider>
          <a href="#main" className="skip-link">
            {txt.skip.text}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SearchModal />
        </ModalProvider>
      </body>
    </html>
  );
}
