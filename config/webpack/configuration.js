// Common configuration for webpacker loaded from config/webpacker.yml

const { resolve } = require('path');
const { env } = require('process');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');

const configPath = resolve('config', 'webpacker.yml');
const settings = safeLoad(readFileSync(configPath), 'utf8')[env.RAILS_ENV || env.NODE_ENV];

function removeOuterSlashes(string) {
  return string.replace(/^\/*/, '').replace(/\/*$/, '');
}

function formatPublicPath(host = '', path = '') {
  let formattedHost = removeOuterSlashes(host);
  if (formattedHost && !/^http/i.test(formattedHost)) {
    formattedHost = `//${formattedHost}`;
  }
  const formattedPath = removeOuterSlashes(path);
  return `${formattedHost}/${formattedPath}/`;
}

const output = {
  path: resolve('public', settings.public_output_path),
  publicPath: formatPublicPath(env.CDN_HOST, settings.public_output_path),
};

module.exports = {
  settings,
  env: {
    CDN_HOST: env.CDN_HOST,
    NODE_ENV: env.NODE_ENV,
    MONTHLY_PRO_PLAN_ID: env.MONTHLY_PRO_PLAN_ID,
    MONTHLY_PRO_PLUS_PLAN_ID: env.MONTHLY_PRO_PLUS_PLAN_ID,
    YEARLY_PRO_PLAN_ID: env.YEARLY_PRO_PLAN_ID,
    YEARLY_PRO_PLUS_PLAN_ID: env.YEARLY_PRO_PLUS_PLAN_ID,
    REDIRECT_URL: env.REDIRECT_URL,
    STRIPE_PUBLISHABLE_KEY: env.STRIPE_PUBLISHABLE_KEY,
  },
  output,
};
