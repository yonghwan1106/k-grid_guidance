/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'picsum.photos', 'example.com', 't1.daumcdn.net'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_KAKAO_API_KEY: process.env.NEXT_PUBLIC_KAKAO_API_KEY,
  },
}

module.exports = nextConfig