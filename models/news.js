'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const NewsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
 	date: {
 		type: Date,
 		required: true
 	},
 	imagePath: {
 		type: String,
 		required: true
  	}
});

NewsSchema.plugin(mongooseApiQuery)
NewsSchema.plugin(createdModified, { index: true })

const News = mongoose.model('News', NewsSchema)
module.exports = News
