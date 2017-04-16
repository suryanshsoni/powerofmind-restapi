'use strict'

/**
 * Module Dependencies
 */
const _      = require('lodash'),
      errors = require('restify-errors'),
	  dateTime = require('node-datetime'),
	  multer = require('multer')

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
	console.log(file);  
    callback(null, file.fieldname + '-' + Date.now()+'.png');
  }
})
var upload = multer({ storage : storage}).single('userPhoto')

/**
 * Model Schema
 */
const MessageOfDay = require('../models/messageofday')
const Video = require('../models/video')
const Audio = require('../models/audio')

server.post('/writemessage', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
    let message = new MessageOfDay(data)
	console.log(message)
    
	 message.save(function(err) {

        if (err!=null) {
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
	MessageOfDay.find(
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
	MessageOfDay.findOne(
	{date:"2017-03-03T18:30:00.000Z"},
	[],
	{
		skip:0, // Starting Row
		limit:1, // Ending Row
		sort:{
			date: -1 //Sort by Date Added DESC
		}
	},
	function(err, doc) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
		console.log("doc is"+doc);
		if(doc!=null)
			res.send(doc)
        else
			res.send(200,"Not found")
		next()

    })

})

/*----------------------------------------------------------------------------------------------------*/

server.post('/addVideo', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
    let video = new Video(data)
	console.log(video)
    
	 video.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201)
        next()

    })

})


server.post('/videos', function(req, res, next) {
	console.log("Sending message");
	let data = req.body || {}
	let index = 0
	if(data!=null)
		index=data.index
	Video.find(
	{},
	[],
	{
		skip:index, // Starting Row
		//limit:10, // Ending Row
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


/*-------------------------------------------------------------------------------------------------------------------*/
server.post('/addAudio', function(req, res, next) {
	
    /*let data = req.body || {}
	console.log(data)
    let audio = new audio(data)
	console.log(audio)
    
	 audio.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201)
        next()

    })*/
	
 upload(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
           console.log(req.body);
           
		res.end("File is uploaded");
		}	
	});

})


server.post('/audios', function(req, res, next) {
	console.log("Sending message");
	let data = req.body || {}
	let index = 0
	if(data!=null)
		index=data.index
	Audio.find(
	{},
	[],
	{
		skip:index, // Starting Row
		//limit:10, // Ending Row
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


server.post('/audio', function(req, res, next) {
	console.log("Sending message");
	let data = req.body || {}
	
	if(data!=null)
		index=data.index
	Audio.find(
	{},
	[],
	{
		skip:index, // Starting Row
		//limit:10, // Ending Row
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


