const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  distDir: 'dist/next',
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }];
  },
};
