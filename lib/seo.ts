import type { Metadata } from "next";

export const siteName = "Scriptorium";
export const siteLocale = "en_US";
export const siteDescription = "A personal knowledge library for notes, learning, documentation, and planning.";
export const socialImagePath = "/scriptorium-social-preview.png";
export const socialImageAlt = "Scriptorium, a personal knowledge library for useful things.";

function resolveSiteOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredOrigin) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Set NEXT_PUBLIC_SITE_URL to the public HTTPS origin before building for production.");
    }
    return new URL("http://localhost:3000");
  }

  let origin: URL;
  try {
    origin = new URL(configuredOrigin);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL such as https://your-real-domain.example.");
  }

  const hostname = origin.hostname.toLowerCase().replace(/\.$/, "");
  const bareHostname = hostname.replace(/^\[|\]$/g, "");
  const ipv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) ? hostname.split(".").map(Number) : null;
  const privateIpv4 = ipv4 !== null && (
    ipv4[0] === 10
    || ipv4[0] === 127
    || ipv4[0] === 0
    || (ipv4[0] === 169 && ipv4[1] === 254)
    || (ipv4[0] === 172 && ipv4[1] >= 16 && ipv4[1] <= 31)
    || (ipv4[0] === 192 && ipv4[1] === 168)
  );
  const localHost = hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname.endsWith(".local")
    || hostname === "0.0.0.0"
    || privateIpv4
    || bareHostname === "::1"
    || bareHostname.startsWith("fc")
    || bareHostname.startsWith("fd")
    || bareHostname.startsWith("fe80:");

  if (
    !["http:", "https:"].includes(origin.protocol)
    || !hostname
    || origin.username
    || origin.password
    || origin.pathname !== "/"
    || origin.search
    || origin.hash
    || (process.env.NODE_ENV === "production" && (origin.protocol !== "https:" || localHost))
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a bare public origin; production requires HTTPS and cannot use localhost.");
  }

  return origin;
}

export const siteOrigin = resolveSiteOrigin();

export function absoluteSiteUrl(pathname: string) {
  if (pathname === "/") return siteOrigin.origin;
  return new URL(pathname, siteOrigin).toString();
}

const socialImage = {
  url: absoluteSiteUrl(socialImagePath),
  width: 1200,
  height: 630,
  alt: socialImageAlt,
};

export const siteMetadata: Metadata = {
  metadataBase: siteOrigin,
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: absoluteSiteUrl("/"),
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
    url: absoluteSiteUrl("/"),
    locale: siteLocale,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const indexableStaticPaths = ["/", "/profile", "/notes"] as const;

export function createPageMetadata({
  path,
  title,
  description,
  indexable = false,
}: {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
}): Metadata {
  const pageUrl = absoluteSiteUrl(path);
  const pageTitle = `${title} | ${siteName}`;
  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: indexable ? pageUrl : null },
    openGraph: {
      type: "website",
      siteName,
      title: pageTitle,
      description,
      url: pageUrl,
      locale: siteLocale,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
    robots: {
      index: indexable,
      follow: true,
    },
  };

  return metadata;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}