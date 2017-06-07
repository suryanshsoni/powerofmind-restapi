'use strict'

module.exports={
	name: 'PowerOfMind',
	version: '0.0.1',
	env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: 'mongodb://test:advantal@35.160.30.218:27017/powerofmind',
    },
}