/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      '*.{glsl,vs,fs,vert,frag}': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  transpilePackages: [
    'three',
    'tsparticles',
    '@tsparticles/react',
    '@tsparticles/slim',
  ],
}

export default nextConfig
