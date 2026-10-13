import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { statSync } from "node:fs";

const serverOrigin = process.env.SEO_TEST_BASE_URL ?? "http://localhost:3101";
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;

assert.ok(configuredOrigin, "Set NEXT_PUBLIC_SITE_URL to the origin used for the production build.");

const indexablePaths = [
  "/",
  "/profile",
  "/notes",
  "/notes/docker-commands",
  "/notes/Java-Roadmap",
];

const routes = [
  ...indexablePaths.map((path) => ({ path, indexable: true })),
  "/notes/git-commands",
  "/notes/linux-commands",
  "/notes/personal",
  "/notes/ideas",
  "/notes/archive",
  "/plans",
  "/plans/weekly",
  "/plans/quarterly",
  "/plans/someday",
  "/documentation",
  "/documentation/getting-started",
  "/documentation/reference",
  "/documentation/changelog",
].map((route) => typeof route === "string" ? { path: route, indexable: false } : route);
const routePaths = new Set(routes.map((route) => route.path));

function expectedSiteUrl(path) {
  const url = new URL(path, configuredOrigin);
  return path === "/" ? url.origin : url.toString();
}

function parseTags(html, tagName) {
  const matcher = new RegExp(`<${tagName}\\b[^>]*>`, "g");
  return [...html.matchAll(matcher)].map(([tag]) => Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name.toLowerCase(), value.replaceAll("&amp;", "&")]),
  ));
}

function metaValue(tags, key, value) {
  return tags.find((tag) => tag[key] === value)?.content ?? null;
}

async function get(path) {
  const response = await fetch(new URL(path, serverOrigin));
  assert.equal(response.status, 200, `${path} should return HTTP 200`);
  return response;
}

const pageResults = [];
for (const route of routes) {
  const response = await get(route.path);
  const html = await response.text();
  const meta = parseTags(html, "meta");
  const links = parseTags(html, "link");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? null;
  const description = metaValue(meta, "name", "description");
  const robots = metaValue(meta, "name", "robots") ?? "";
  const canonical = links.find((link) => link.rel === "canonical")?.href ?? null;
  const expectedCanonical = route.indexable ? expectedSiteUrl(route.path) : null;
  const ogImage = metaValue(meta, "property", "og:image");
  const twitterImage = metaValue(meta, "name", "twitter:image");
  const iconLinks = links.filter((link) => link.rel === "icon");

  assert.ok(title, `${route.path} needs a document title`);
  assert.ok(description, `${route.path} needs a meta description`);
  assert.equal(iconLinks.length, 1, `${route.path} should have exactly one favicon link`);
  assert.match(iconLinks[0].href, /^\/icon\.svg\?/);
  assert.equal(iconLinks[0].type, "image/svg+xml");
  assert.equal(metaValue(meta, "property", "og:title"), title);
  assert.equal(metaValue(meta, "property", "og:description"), description);
  assert.equal(metaValue(meta, "property", "og:url"), expectedSiteUrl(route.path));
  assert.equal(metaValue(meta, "property", "og:image:width"), "1200");
  assert.equal(metaValue(meta, "property", "og:image:height"), "630");
  assert.ok(metaValue(meta, "property", "og:image:alt"));
  assert.ok(new URL(ogImage).protocol === "https:");
  assert.equal(metaValue(meta, "name", "twitter:card"), "summary_large_image");
  assert.equal(metaValue(meta, "name", "twitter:title"), title);
  assert.equal(metaValue(meta, "name", "twitter:description"), description);
  assert.equal(twitterImage, ogImage);
  assert.ok(metaValue(meta, "name", "twitter:image:alt"));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route.path} should have one primary heading`);

  for (const link of parseTags(html, "a")) {
    if (!link.href?.startsWith("/") || link.href.startsWith("//")) continue;
    const linkedPath = new URL(link.href, "https://scriptorium.invalid").pathname;
    assert.ok(routePaths.has(linkedPath), `${route.path} links to missing route ${linkedPath}`);
  }

  if (route.indexable) {
    assert.match(robots, /\bindex\b/);
    assert.match(robots, /\bfollow\b/);
    assert.doesNotMatch(robots, /noindex/);
    assert.equal(canonical, expectedCanonical);
  } else {
    assert.match(robots, /noindex/);
    assert.equal(canonical, null, `${route.path} must not inherit a homepage canonical`);
  }

  pageResults.push({ path: route.path, title });
}

for (const path of ["/not-a-real-route", "/notes/not-a-real-note"]) {
  const response = await fetch(new URL(path, serverOrigin));
  assert.equal(response.status, 404, `${path} should return HTTP 404`);
  const html = await response.text();
  const meta = parseTags(html, "meta");
  const links = parseTags(html, "link");
  assert.match(metaValue(meta, "name", "robots") ?? "", /noindex/);
  assert.equal(links.find((link) => link.rel === "canonical")?.href, undefined);
  assert.equal(metaValue(meta, "property", "og:title"), null);
}

const indexableTitles = pageResults.filter(({ path }) => indexablePaths.includes(path)).map(({ title }) => title);
assert.equal(new Set(indexableTitles).size, indexableTitles.length, "Indexable page titles should be unique");

const sitemapResponse = await get("/sitemap.xml");
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
const expectedSitemapUrls = indexablePaths.map(expectedSiteUrl).sort();
assert.deepEqual([...sitemapUrls].sort(), expectedSitemapUrls, "Sitemap should contain only the approved indexable routes");

const robotsResponse = await get("/robots.txt");
const robotsText = await robotsResponse.text();
assert.match(robotsText, /User-Agent: \*/);
assert.match(robotsText, /Allow: \/?/);
assert.match(robotsText, new RegExp(`Sitemap: ${new URL("/sitemap.xml", configuredOrigin).toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
assert.doesNotMatch(robotsText, /Disallow:/);

const socialResponse = await get("/scriptorium-social-preview.png");
const socialBytes = Buffer.from(await socialResponse.arrayBuffer());
assert.match(socialResponse.headers.get("content-type") ?? "", /^image\/png/);
assert.equal(socialBytes.readUInt32BE(16), 1200);
assert.equal(socialBytes.readUInt32BE(20), 630);

const homeResponse = await get("/");
const homeHtml = await homeResponse.text();
const jsonLd = [...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
assert.ok(jsonLd.some((item) => item["@type"] === "WebSite"));

const profileResponse = await get("/profile");
const profileHtml = await profileResponse.text();
const profileJsonLd = [...profileHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
assert.ok(profileJsonLd.some((item) => item["@type"] === "ProfilePage" && item.mainEntity?.["@type"] === "Person"));
assert.doesNotMatch(profileHtml.slice(0, profileHtml.indexOf("</head>")), /sanketsabale2003@gmail\.com/);

const iconHref = parseTags(homeHtml, "link").find((link) => link.rel === "icon")?.href;
assert.ok(iconHref);
const iconResponse = await get(iconHref);
assert.match(iconResponse.headers.get("content-type") ?? "", /^image\/svg\+xml/);
assert.match(await iconResponse.text(), /<svg[\s\S]*?>[\s\S]*?S[\s\S]*?<\/svg>/);

const profileImageTag = parseTags(profileHtml, "img").find((tag) => tag.alt === "Portrait of Sanket Sabale");
assert.ok(profileImageTag?.src, "Profile photo should have a real source and descriptive alt text");
const responsiveImageSrc = profileImageTag.srcset
  ?.split(",")
  .map((candidate) => candidate.trim().split(/\s+/))
  .find(([, width]) => width === "256w")?.[0];
assert.ok(responsiveImageSrc, "Profile photo should include a right-sized responsive candidate");
const profileImageResponse = await fetch(new URL(responsiveImageSrc, serverOrigin), {
  headers: { accept: "image/avif,image/webp,image/*,*/*" },
});
assert.equal(profileImageResponse.status, 200);
assert.match(profileImageResponse.headers.get("content-type") ?? "", /^image\//);
const optimizedProfileImage = Buffer.from(await profileImageResponse.arrayBuffer());
assert.ok(optimizedProfileImage.length < statSync("public/profile_photo.png").size, "Responsive profile rendition should be smaller than the original PNG");

console.log(`SEO checks passed for ${routes.length} pages, sitemap, robots, JSON-LD, favicon, social card, and profile image.`);