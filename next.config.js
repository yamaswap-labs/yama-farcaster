/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      // Set body size limit to 10MB (10 * 1024 * 1024 bytes)
      bodySizeLimit: 10485760,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-v1.raydium.io',
        pathname: '/icon/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: 'infura-ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'yama.mypinata.cloud',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/main-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/ai-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_API_URL}/:path*`,
      },
      {
        source: '/point-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_POINT_API_URL}/:path*`,
      },
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    };
    return config;
  },
};

module.exports = nextConfig;
