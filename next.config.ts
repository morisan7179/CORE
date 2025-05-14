// next.config.js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 開発中は無効
});

const nextConfig = withPWA({
  // ここに他の設定があれば追加
});

module.exports = nextConfig;
