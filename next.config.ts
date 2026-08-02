import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  // Stop announcing the framework in every response — free reconnaissance
  // for an attacker probing for framework-specific CVEs (B13.3).
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ui-avatars.com' }],
  },
  // Security headers (B13.3). No Content-Security-Policy here on purpose —
  // see docs/deployment.md#known-gaps: a real CSP would need to account for
  // Next's inline bootstrap scripts and next-themes' blocking anti-flash
  // script, and a broken CSP fails silently in the browser console, not in
  // a curl check. Tracked as deliberate debt, not implemented blind.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Tells browsers to only ever contact this origin over HTTPS,
            // including subdomains, for a year — closes the gap noted in
            // docs/deployment.md (TLS is terminated by Traefik, but nothing
            // previously told the browser to require it on every visit).
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            // Stops browsers from MIME-sniffing a response into a type
            // other than the declared Content-Type (e.g. serving a JSON
            // response as executable script).
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Blocks the app from being framed by another origin —
            // equivalent to (and more widely supported than) relying on
            // CSP's frame-ancestors alone, and mitigates clickjacking.
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Only send the full URL as a referrer on same-origin
            // navigations; cross-origin requests get the origin only, and
            // downgrades (https → http) send nothing.
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
