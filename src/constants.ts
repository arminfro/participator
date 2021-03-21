import Prism from 'prismjs';

export const noop = () => {
  /* no-op */
};

export const chatMsgDeleted = '*Message got deleted*';

export const domain = process.env.domain || 'localhost';
export const port = process.env.port || 3000;
export const protocol = process.env.protocol || 'http';
export const url = `${domain}:${port}`;
export const urlWithProtocol = `${protocol}://${url}`;

export const prismLanguageMap = {
  css: Prism.languages.css,
  html: Prism.languages.html,
  javascript: Prism.languages.javascript,
  js: Prism.languages.js,
  jsx: Prism.languages.jsx,
  svg: Prism.languages.svg,
  ts: Prism.languages.ts,
  tsx: Prism.languages.tsx,
  typescript: Prism.languages.typescript,
  xml: Prism.languages.xml,
};
