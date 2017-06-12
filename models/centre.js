'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const CentreSchema = new mongoose.Schema({
	address: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	pin: {
		type: Number,
		required: true
	},
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	}
	
});

CentreSchema.plugin(mongooseApiQuery)
CentreSchema.plugin(createdModified, { index: true })

const Centre = mongoose.model('Centre', CentreSchema)
module.exports = Centre
