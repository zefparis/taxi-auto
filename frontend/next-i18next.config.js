module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ln', 'sw'],
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
