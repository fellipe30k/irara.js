const path = require('path')

module.exports = {
  webpack5: true,
  webpack: config => {
    config.resolve.modules.push(path.resolve('./'));
    config.resolve.fallback = { fs: false };

    return config
  }
}
