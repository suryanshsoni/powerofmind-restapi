'use strict'

/**
 * Module Dependencies
 */
const _      = require('lodash'),
      errors = require('restify-errors'),
	  dateTime = require('node-datetime');

/**
 * Model Schema
 */
const ThoughtOfDay = require('../models/thoughtofday')


server.post('/writethought', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
    let thought = new ThoughtOfDay(data)
	console.log(thought)
    
	console.log(thought)
    thought.save(function(err) {

        if (err) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201)
        next()

    })

})


server.post('/message1', function(req, res, next) {
	console.log("Sending message");
	ThoughtOfDay.find(
	{},
	[],
	{
		skip:0, // Starting Row
		limit:10, // Ending Row
		sort:{
			date: -1 //Sort by Date Added DESC
		}
	},
	function(err, doc) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }

        res.send(doc)
        next()

    })

})

server.post('/message', function(req, res, next) {
	console.log("Sending message");
	ThoughtOfDay.findOne(
	{_id:"58f0d2238090513f58d6305c"},
	[],
	{
		skip:0, // Starting Row
		limit:1, // Ending Row
		sort:{
			date: -1 //Sort by Date Added DESC
		}
	},
	function(err, doc) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }

        res.send(doc)
        next()

    })

})
