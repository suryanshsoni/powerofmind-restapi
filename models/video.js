'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const VideoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
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

VideoSchema.plugin(mongooseApiQuery)
VideoSchema.plugin(createdModified, { index: true })

const Video = mongoose.model('Video', VideoSchema)
module.exports = Video
