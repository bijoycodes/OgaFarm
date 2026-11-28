// Keep the capture browser inside this folder (git-ignored), not in the home folder.
module.exports = { cacheDirectory: require('path').join(__dirname, '.cache', 'puppeteer') };
