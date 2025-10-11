import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@prisma/client/**/*'],
  },
};

export default nextConfig;
