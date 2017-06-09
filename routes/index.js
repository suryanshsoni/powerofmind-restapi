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
var storageAudio	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/audio');
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
var storageMessage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/messages');
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
var storageEvent	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/events');
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
var uploadAudio = multer({ storage : storageAudio}).single('file')
var uploadMessage = multer({ storage : storageMessage}).single('file')
var uploadEvent = multer({ storage : storageEvent}).single('file')
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
	
	uploadMessage(req,res,function(err) {
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

server.post('/updateMessage',function(req, res, next){
	console.log("updating message" + req.body.id)
	MessageOfDay.findById(mongoose.mongo.ObjectId(req.body.id),
	function(err,message){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating")
			
			uploadMessage(req,res,function(err) {
				if(err) {
					return res.end(err+" Error uploading file.");
				}
				else {
					console.log(req.file);	
					console.log(req.body);
					
					message.date=req.body.date
					message.message=req.body.message
					if(req.file!=null)
						message.imagePath=req.file.path 
					
					
					console.log(message)

					message.save(function(err) {

						if (err!=null) {
							log.error(err)
							return next(new errors.InternalError(err.message))
							next()
						}

						res.send(201,"File Updated")
						next()

					})
				}	
			});
			
			
		}
			
	})
})

server.post('/countMessages', function(req, res, next) {
	console.log("counting messages");
	MessageOfDay.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("MessageOfDay count is:",count)
		}
			res.send(200,count)
		next()

    })

})



/*----------------------------------------------------------------------------------------------------*/

server.post('/addVideo', function(req, res, next) {
	
    let data = req.body || {}
	console.log("adding video",data)
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
	console.log("Sending video");
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

server.post('/removeVideo', function(req, res, next) {
	console.log("removing video");
	Video.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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

server.post('/updateVideo',function(req, res, next){
	console.log("updating video" + req.body.id)
	Video.findById(mongoose.mongo.ObjectId(req.body.id),
	function(err,video){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating",video)
			video.title=req.body.title
			video.desc=req.body.desc
			video.videoPath=req.body.videoPath
			console.log("updated",video)
			video.save(function(err){
				if(err!=null){
				log.error(err)
					return next(new errors.InternalError(err.message))
					next()	
				}
				res.send(200,"UPDATED")
				next()
			})
		}
			
	})
})

/*
server.post('/updateVideo',function(req, res, next){
	console.log("updating video" + req.body._id)
	let data = req.body || {}
	console.log(data)
	data=req.body
    let video = new Video(data)
	console.log(video)
	Video.findByIdAndUpdate(mongoose.mongo.ObjectId(req.body.id),
	video,
	function(err,video){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updated",video)
			
				res.send(200,"UPDATED")
				next()
			}
	}
			
	)
})
*/
server.post('/countVideos', function(req, res, next) {
	console.log("counting videos");
	Video.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("Video count is:",count)
		}
			res.send(200,count)
		next()

    })

})


/*-------------------------------------------------------------------------------------------------------------------*/
server.post('/addAudio', function(req, res, next) {
	
    
	
	uploadAudio(req,res,function(err) {
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
	console.log("Sending audios");
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
	console.log("Sending audio");
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
server.post('/removeAudio', function(req, res, next) {
	console.log("removing audio");
	Audio.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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



server.post('/updateAudio',function(req, res, next){
	console.log("updating audio")
	console.log("start----------------================")
	console.log(req.query.id);
	console.log("end----------------================")
	Audio.findById(mongoose.mongo.ObjectId(req.query.id),
	function(err,audio){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating")
			
			upload(req,res,function(err) {
				if(err) {
					return res.end(err+" Error uploading file.");
				}
				else {
					console.log(req.file);	
					console.log(req.body);
					
					audio.title=req.body.title
					audio.desc=req.body.desc
					if(req.file!=null)
						audio.audioPath=req.file.path
					
					
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
			
			
		}
			
	})
})


server.post('/countAudios', function(req, res, next) {
	console.log("counting audios");
	Audio.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("Audio count is:",count)
		}
			res.send(200,count)
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
server.post('/removeLiveDarshan', function(req, res, next) {
	console.log("removing Live Darshan");
	LiveDarshan.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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
server.post('/updateLiveDarshan',function(req, res, next){
	console.log("updating live darshan" + req.body.id)
	LiveDarshan.findById(mongoose.mongo.ObjectId(req.body.id),
	function(err,live){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating")
			console.log("live darshan doc:",live);
			live.title=req.body.title
			live.desc=req.body.desc
			live.videoPath=req.body.videoPath
			
			live.save(function(err){
				if(err!=null){
				log.error(err)
					return next(new errors.InternalError(err.message))
					next()	
				}
				res.send(200,"UPDATED")
				next()
			})
		}
			
	})
})

server.post('/countLiveDarshan', function(req, res, next) {
	console.log("counting live darshan");
	LiveDarshan.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("LiveDarshan count is:",count)
		}
			res.send(200,count)
		next()

    })

})
/*--------------------------------------------------------------------------------------------*/

server.post('/addEvent', function(req, res, next) {
	
        let data={
					"name": req.body.name,
					"title": req.body.title,
					"venue": req.body.venue,
					"date": req.body.date,
					"desc": req.body.desc
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
	Events.findById(mongoose.mongo.ObjectId(req.body.id),
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
server.post('/removeEvent', function(req, res, next) {
	console.log("removing event");
	Events.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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
server.post('/countEvents', function(req, res, next) {
	console.log("counting events");
	Events.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("Event count is:",count)
		}
			res.send(200,count)
		next()

    })

})

server.post('/updateEventold',function(req, res, next){
	console.log("updating event" + req.body.id)
	uploadEvent(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
			
			
			Events.findById(mongoose.mongo.ObjectId(req.body.id),
			function(err,events){
				if(err!=null){
					log.error(err)
					return next(new errors.InvalidContentError(err.errors.name.message))
				}
				else{
					events.name = req.body.name,
					events.title = req.body.title,
					events.venue = req.body.venue,
					events.date = req.body.date,
					events.desc =  req.body.desc,
					events.imagePath = req.file.path
					events.save(function(err){
						if(err!=null){
							log.error(err)
							return next(new errors.InternalError(err.message))
							next()	
						}
						res.send(200,"UPDATED")
						next()
					})
				}		
			})
		}	
	});
})

server.post('/updateEvent',function(req, res, next){
	console.log("updating event" + req.body.id)
	Events.findById(mongoose.mongo.ObjectId(req.body.id),
		function(err,events){
			if(err!=null){
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
			}
			else{
	
				uploadEvent(req,res,function(err) {
					if(err) {
						return res.end(err+" Error uploading file.");
					}
					else {
						console.log(req.file);	
						console.log(req.body);
						
						events.name = req.body.name
						events.title = req.body.title
						events.venue = req.body.venue
						events.date = req.body.date
						events.desc =  req.body.desc
						if(req.file!=null)
							events.imagePath = req.file.path
						events.save(function(err){
							if(err!=null){
								log.error(err)
								return next(new errors.InternalError(err.message))
								next()	
							}
							res.send(200,"UPDATED")
							next()
						})
			
			
					}	
				});
					
			}		
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
server.post('/removeNews', function(req, res, next) {
	console.log("removing news");
	News.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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

server.post('/countNews', function(req, res, next) {
	console.log("counting news");
	News.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("News count is:",count)
		}
			res.send(200,count)
		next()

    })

})