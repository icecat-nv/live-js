module.exports = function getLegacyIcecatLiveAsync() {
  return import(/* webpackChunkName: "LegacyIcecatLive" */ '../legacy/main')
    .catch(err => console.error('Error occured while loading Legacy IcecatLive \n', err))
}