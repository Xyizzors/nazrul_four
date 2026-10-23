import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isVercel = process.env.VERCEL === "1";
/** Set by `npm run edit`: switches on the click-to-edit visual editor (development only). */
const visualEdit = isDev && process.env.NZ_EDIT === "1";

const config: NextConfig = {
  // Production: plain static files in out/ that any host (including cPanel) can serve.
  // Development: a normal server, which the control panel needs in order to save files.
  // On Vercel the normal Next.js build is used (every page is still prerendered as static HTML),
  // because Vercel expects the standard .next output rather than an out/ folder.
  output: isDev || isVercel ? undefined : "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Files named page.dev.tsx / route.dev.ts (the control panel and its API) only exist in development,
  // so they can never end up on the live website.
  pageExtensions: isDev ? ["tsx", "ts", "dev.tsx", "dev.ts"] : ["tsx", "ts"],
  // The visual editor tags every editable value so a click on the page can be traced back to its data.
  ...(visualEdit && {
    turbopack: {
      rules: {
        "**/data/*.json": {
          loaders: [require.resolve("./lib/visual/tag-loader.js")],
          as: "*.json",
        },
      },
    },
  }),
};

export default config;
