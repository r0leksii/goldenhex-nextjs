/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s3-eu-west-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
        port: "",
        pathname: "/eposnow-assets/Images/CompanyProductImages/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
