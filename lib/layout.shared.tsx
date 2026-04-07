import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: "Cobru Docs",
      url: `/${locale}`,
    },
    links: [
      {
        text: locale === "es" ? "API Reference" : "API Reference",
        url: `/${locale}/docs/api/reference`,
      },
    ],
    i18n: true,
  };
}
