'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const ThoughtOfDaySchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	thought: {
		type: String,
		required: true
	},
	imagePath:{
		type: String
	}
});

ThoughtOfDaySchema.plugin(mongooseApiQuery)
ThoughtOfDaySchema.plugin(createdModified, { index: true })

const ThoughtOfDay = mongoose.model('ThoughtOfDay', ThoughtOfDaySchema)
module.exports = ThoughtOfDay
