'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const EventsSchema = new mongoose.Schema({
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
	}
});

EventsSchema.plugin(mongooseApiQuery)
EventsSchema.plugin(createdModified, { index: true })

const Events = mongoose.model('Events', EventsSchema)
module.exports = Events
