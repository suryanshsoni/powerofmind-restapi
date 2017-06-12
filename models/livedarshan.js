'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const LiveDarshanSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	date: {
 		type: Date,
 		required: true
 	},
	time: {
 		type: String,
 		required: true
 	},
	venue:{
		type: String,
		required:true
	},
	videoPath:{
		type: String,
		required:true
	},
	desc: {
		type: String,
		required: true
	}
});

LiveDarshanSchema.plugin(mongooseApiQuery)
LiveDarshanSchema.plugin(createdModified, { index: true })

const LiveDarshan = mongoose.model('LiveDarshan', LiveDarshanSchema)
module.exports = LiveDarshan
