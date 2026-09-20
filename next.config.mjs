const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static export for GitHub Pages (no server runtime).
  output: "export",
  images: { unoptimized: true },
  // Path prefix while the site is served from https://<user>.github.io/<repo>/.
  // Must stay empty once a custom domain (vaibhav.is-a.dev) is connected;
  // the deploy workflow sets this automatically from repository variables.
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
