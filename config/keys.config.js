if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod.config');
} else {
    module.exports = require('./keys.dev.config');
}
