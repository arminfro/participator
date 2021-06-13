// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (...args: any[]): any => {
  /* no-op */
};

export const chatMsgDeleted = '*Message got deleted*';

export const domain = process.env.domain || 'localhost';
export const port = process.env.port || 3000;
export const protocol = process.env.protocol || 'http';
export const url = `${domain}:${port}`;
export const urlWithProtocol = `${protocol}://${url}`;

export const staticRoot = `/static`;
export const staticUrl = `${urlWithProtocol}${staticRoot}`;
export const avatarRoot = `${staticRoot}/avatar`;
export const avatarUrl = `${staticUrl}/avatar`;
