let inPage = require('./inPage'),
    envConfig = require('config/env.json'),
    stylesheet = require('./sass/legacy.scss')

inPage.envConfig = envConfig;

module.exports = inPage
