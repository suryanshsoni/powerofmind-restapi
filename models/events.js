'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const EventSchema = new mongoose.Schema({
	name: {
		type: String
	},
	title: {
		type: String,
		required: true
	},
	venue: {
		type: String,
		required: true
	},
	date:{
		type: Date,
		required:true
	},
	desc: {
		type: String,
		required: true
	},
	imagePath: {
		type: String,
		required: true
	}
});

EventSchema.plugin(mongooseApiQuery)
EventSchema.plugin(createdModified, { index: true })

const Events = mongoose.model('Event', EventSchema)
module.exports = Event
