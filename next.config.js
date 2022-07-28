/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'redditcloneantonio2da771ad85e74a92b8e5ebbe8b560141651-dev.s3.eu-west-2.amazonaws.com',
      'source.unsplash.com',
    ],
  },
};

module.exports = nextConfig;
