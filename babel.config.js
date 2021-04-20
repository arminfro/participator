module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer);
  const isCallerDevelopment = api.caller((caller) => caller?.isDev);

  api.cache(true);

  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          importSource:
            !isServer && isCallerDevelopment
              ? '@welldone-software/why-did-you-render'
              : 'react',
        },
      },
    ],
  ];

  const plugins = [
    [
      'prismjs',
      {
        languages: ['javascript', 'typescript', 'jsx', 'tsx', 'css', 'markup'],
        theme: 'coy',
        css: true,
      },
    ],
  ];
  return { presets, plugins };
};
