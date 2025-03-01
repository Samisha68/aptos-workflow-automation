
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APTOS_NODE_URL: process.env.NEXT_PUBLIC_APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com"
  },
  experimental:{
    appDir: true,
  }
};



