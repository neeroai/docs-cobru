import { RootProvider } from "fumadocs-ui/provider/next";
import { DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import type { ReactNode } from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={dmSans.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <RootProvider
            i18n={{
              locale,
              locales: [
                { locale: "en", name: "English" },
                { locale: "es", name: "Español" },
              ],
            }}
          >
            {children}
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
