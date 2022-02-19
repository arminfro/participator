const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  distDir: 'dist/next',
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }];
  },
};
