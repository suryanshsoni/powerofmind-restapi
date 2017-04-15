'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const AudioSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	audioPath:{
		type: String,
		required:true
	},
	desc: {
		type: String,
		required: true
	}
});

AudioSchema.plugin(mongooseApiQuery)
AudioSchema.plugin(createdModified, { index: true })

const Audio = mongoose.model('Audio', AudioSchema)
module.exports = Audio
