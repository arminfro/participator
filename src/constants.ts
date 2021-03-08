export const noop = () => {
  /* no-op */
};

export const domain = process.env.domain || 'localhost';
export const port = process.env.port || 3000;
export const protocol = process.env.protocol || 'http';
export const url = `${domain}:${port}`;
