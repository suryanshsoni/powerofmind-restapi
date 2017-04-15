'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const MessageOfDaySchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	imagePath:{
		type: String
	}
});

MessageOfDaySchema.plugin(mongooseApiQuery)
MessageOfDaySchema.plugin(createdModified, { index: true })

const MessageOfDay = mongoose.model('MessageOfDay', MessageOfDaySchema)
module.exports = MessageOfDay
