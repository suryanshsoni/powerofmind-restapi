'use strict'

module.exports={
	name: 'PowerOfMind',
	version: '0.0.1',
	env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: 'mongodb://localhost:27017/powerofmind',
    },
	MY_SECRET:"thisismysecretcodekjkbku2441gvbjnjsnf1412321jnwjenvajdbgdh2fjwbghbfkj62ngiu"
}