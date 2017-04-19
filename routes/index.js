'use strict'

/**
 * Module Dependencies
 */
const _      = require('lodash'),
      errors = require('restify-errors'),
	  dateTime = require('node-datetime'),
	  multer = require('multer'),
	  mongoose = require('mongoose')

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    var filename=file.originalname.split(".");
   var extension=filename[filename.length-1];
	filename.pop();
	var name=filename.join();
	console.log("storing with "+name);
    callback(null, name + '-' + Date.now()+'.'+extension);
  }
})
var upload = multer({ storage : storage}).single('file')

/**
 * Model Schema
 */
const MessageOfDay = require('../models/messageofday')
const Video = require('../models/video')
const Audio = require('../models/audio')
const LiveDarshan = require('../models/livedarshan')
const News = require('../models/news')
const Events = require('../models/events')

server.post('/writemessage', function(req, res, next) {
	
	upload(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
			let data={}
			if(req.file!=null){ 
				data={
					'date':req.body.date,
					'message':req.body.message,
					'imagePath':req.file.path || {}
				}
			}
			else{
				data={
					'date':req.body.date,
					'message':req.body.message,
					'imagePath':''
				}
			}
			
			let message = new MessageOfDay(data)
			console.log(message)
			
			message.save(function(err) {

				if (err!=null) {
					log.error(err)
					return next(new errors.InternalError(err.message))
					next()
				}

				res.send(201,"ADDED")
				next()

			})
		}	
	});

})

	
server.post('/message1', function(req, res, next) {
	console.log("Sending message");
	MessageOfDay.find(
	{},
	[],
	{
		skip:0, // Starting Row
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
server.post('/getMessageDetails', function(req, res, next) {
	console.log("Sending message details");
	MessageOfDay.findById(mongoose.mongo.ObjectId(req.body.id),
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

server.post('/removeMessage', function(req, res, next) {
	console.log("removing message");
	MessageOfDay.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
	function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else
			res.send(200,"DELETED")
		next()

    })

})
/*----------------------------------------------------------------------------------------------------*/

server.post('/addVideo', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
	data={
		"title":req.body.title,
		"desc":req.body.desc,
		"videoPath":req.body.videoPath
	}
    let video = new Video(data)
	console.log(video)
    
	 video.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201,"ADDED")
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

server.post('/getVideoDetails', function(req, res, next) {
	console.log("Sending video details");
	Video.findById(mongoose.mongo.ObjectId(req.body.id),
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
/*-------------------------------------------------------------------------------------------------------------------*/
server.post('/addAudio', function(req, res, next) {
	
    
	
	upload(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
            let data={
				'title':req.body.title,
				'desc':req.body.desc,
				'audioPath':req.file.path
			}
			
			let audio = new Audio(data)
			console.log(audio)
    
			audio.save(function(err) {

				if (err!=null) {
					log.error(err)
					return next(new errors.InternalError(err.message))
					next()
				}

				res.send(201,"File Uploaded")
				next()

			})
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

server.post('/getAudioDetails', function(req, res, next) {
	console.log("Sending audio details");
	Audio.findById(mongoose.mongo.ObjectId(req.body.id),
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
/*-------------------------------------------------------------------------------------------------*/
server.post('/addLiveDarshan', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
	data={
		"title":req.body.title,
		"desc":req.body.desc,
		"videoPath":req.body.videoPath
	}
    let livedarshan = new LiveDarshan(data)
	console.log(livedarshan)
    
	 livedarshan.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201,"ADDED")
        next()

    })

})

server.post('/liveDarshan', function(req, res, next) {
	console.log("Sending live darshan");
	let data = req.body || {}
	let index = 0
	if(data!=null)
		index=data.index
	LiveDarshan.find(
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
server.post('/getLiveDarshanDetails', function(req, res, next) {
	console.log("Sending live darshan details");
	LiveDarshan.findById(mongoose.mongo.ObjectId(req.body.id),
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
/*--------------------------------------------------------------------------------------------*/

server.post('/addEvent', function(req, res, next) {
	
	upload(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
            let data={
					"name": req.body.name,
					"title": req.body.title,
					"venue": req.body.venue,
					"date": req.body.date,
					"desc": req.body.desc,
					"imagePath": req.file.path
				}
			
			let events = new Events(data)
			console.log(events)
			
			 events.save(function(err) {

				if (err!=null) {
					log.error(err)
					return next(new errors.InternalError(err.message))
					next()
				}

				res.send(201,"ADDED")
				next()

			})
		}	
	});
    

})

server.post('/events', function(req, res, next) {
	console.log("Sending event list");
	let data = req.body || {}
	
	let index = 0
	if(data!=null)
		index=data.index
	Events.find(
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
server.post('/getEventDetails', function(req, res, next) {
	console.log("Sending event details");
	Event.findById(mongoose.mongo.ObjectId(req.body.id),
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
/*-------------------------------------------------------------------------------------------------*/
server.post('/addNews', function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
    let news = new News(data)
	console.log(news)
    
	 news.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201,"ADDED NEWS")
        next()

    })

})

server.post('/news', function(req, res, next) {
	console.log("Sending news");
	let data = req.body || {}
	let index = 0
	if(data!=null)
		index=data.index
	News.find(
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
server.post('/getNewsDetails', function(req, res, next) {
	console.log("Sending news details");
	News.findById(mongoose.mongo.ObjectId(req.body.id),
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