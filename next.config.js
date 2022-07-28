/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'redditcloneupdated89e3574a42214312a1209398bafb9153006-dev.s3.eu-west-2.amazonaws.com',
      'source.unsplash.com',
    ],
  },
};

module.exports = nextConfig;
