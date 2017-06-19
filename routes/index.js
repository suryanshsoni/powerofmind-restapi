'use strict'

/**
 * Module Dependencies
 */
const _      = require('lodash'),
      errors = require('restify-errors'),
	  dateTime = require('node-datetime'),
	  multer = require('multer'),
	  mongoose = require('mongoose'),
	  config = require('../config'),
	  passport = require('passport-restify'),
	  nJwt = require('njwt')

 /**
 * Model Schema
 */

const MessageOfDay = require('../models/messageofday')
const Video = require('../models/video')
const Audio = require('../models/audio')
const LiveDarshan = require('../models/livedarshan')
const News = require('../models/news')
const Events = require('../models/events')
const User = require('../models/user')	  
const Article = require('../models/article')

//passport initialization
server.use(passport.initialize());

require('../auth_controllers/passport')(passport);
var ctrlLogin = require('../auth_controllers/login') 


var authnjwt = function(req,res,next){
	//let token = req.headers.authorization.split(" ")[1];
	let token = req.authorization.credentials
	nJwt.verify(token,config.MY_SECRET,function(err,verifiedJwt){
  if(err){
    console.log(err); // Token has expired, has been tampered with, etc
	var jsRes={"status":"Tampered/Expired token"};
	res.send(400,jsRes);
	
  }else{
	var jwtbody=verifiedJwt.body
	var id=jwtbody['_id'];	
    console.log(verifiedJwt," ",token); // Will contain the header and body
	User.findById(mongoose.mongo.ObjectId(id),
	function(err, doc) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
		console.log("doc is"+doc);
		if(doc!=null && doc.token==token){
			next()
		}
        else{
			res.header('Location',"/admin");
			res.send(200,{"status":"Not found/Wrong Credentials"})
		}
			

    })
  }
});
}

//multer upload setup
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
var storageNews	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/news');
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

var storageArticle	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/articles');
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
var uploadNews = multer({ storage : storageNews}).single('file')
var uploadEvent = multer({ storage : storageEvent}).single('file')
var uploadArticle = multer({ storage : storageArticle}).single('file')


/*----------------------------------------------------------------------------------------------*/

server.post('/register',function(req,res,next){
  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);
  user.count=0;
  user.save(function(err) {
	if (err!=null) {
		log.error(err)
		//console.log( new errors.InternalError(err.message))
		res.send(400,{"status":false,"err":err.message})
		return
	}
    var token;
    token = user.generateJwt();
	var state = user.setLoggedIn(token);
	if(state==true){
		res.status(200);
		res.json({
		  "token" : token,
		  "status":true
		});	
	}
			
  });
})
server.post("/authenticate",authnjwt,function(req,res){
		res.send(200,{"status":"OK"})
})
/*
server.post('/login',function(req,res,next){
	  User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
			log.error(err)
			return next(new errors.InternalError(err.message))
			next()
		}
      // Return if user not found in database
      if (!user) {
			res.send(201,"User not found")
			next()
      }
      // Return if password is wrong
      if (!user.validPassword(req.body.password)) {
			res.send(201,"Wrong Password")
			next()

      }
      // If credentials are correct, return the user object
	  let doc={
		  'email':user.email,
		  'token':user.generateJwt()
	  }
      res.send(doc)
	  next()
    });
})
*/
/*
server.post('/login',passport.authenticate('local'), function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })
*/
server.post('/login',ctrlLogin.login)
server.post('/logout',function(req, res,next){
	
    User.findById(mongoose.mongo.ObjectId(req.body.id),
		function(err, user) {

			if (err!=null) {
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
			}
			console.log("user is"+user);
			user.token=''
			user.loggedIn=false
			user.save(function(err){
				if (err!=null) {
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
				}
				res.redirect("/admin",next)
			})
				

    })
  })

  server.post('/changePassword',authnjwt,function(req,res,next){
	console.log("changing password")
	User.findById(mongoose.mongo.ObjectId(req.body.id),
		function(err, user) {

			if (err!=null) {
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
			}
			console.log("user is"+user);
			if (!user.validPassword(req.body.cur_password)) {
				res.send(200,{"status":false,"err":"Wrong Password"})
				next()
			}
			else{
					user.setPassword(req.body.new_password);
			user.save(function(err){
				if (err!=null) {
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
				}
				res.send(200,{"status":true})
			})
			}
			
				

    })
  })

/*----------------------------------------------------------------------------------------------*/
server.post('/writemessage', authnjwt,function(req, res, next) {
	
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
server.post('/messagelast', function(req, res, next) {
	console.log("Sending message");
	var datetime = new Date();
	console.log(datetime);
	MessageOfDay.find(
	{
		date:{$lte:datetime} 
	},
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
	var datetime = new Date();
	console.log(datetime);
	MessageOfDay.findOne(
	{date:datetime},
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

server.post('/removeMessage',authnjwt, function(req, res, next) {
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

server.post('/updateMessage',authnjwt,function(req, res, next){
	console.log("updating message")
	console.log("start----------------================")
	let id=null;
	console.log(req);
	if(typeof req.query.id=="undefined"){
		console.log("inside if ");
		id=req.body.id;
		
	}
	else{
		console.log("else part");
		id=req.query.id;
	}

	console.log("end----------------================")
	console.log("ID IS ______________--------------"+id);
	MessageOfDay.findById(mongoose.mongo.ObjectId(id),
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

server.post('/addVideo',authnjwt, function(req, res, next) {
	//console.log(req.headers.authorization.split(" ")[1])
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

server.post('/removeVideo',authnjwt, function(req, res, next) {
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

server.post('/updateVideo',authnjwt,function(req, res, next){
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
server.post('/addAudio', authnjwt,function(req, res, next) {
	
    
	
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
server.post('/removeAudio',authnjwt, function(req, res, next) {
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



server.post('/updateAudio',authnjwt,function(req, res, next){
	console.log("updating audio")
	console.log("start----------------================")
	let id=null;
	console.log(req);
	if(typeof req.query.id=="undefined"){
		console.log("inside if ");
		id=req.body.id;
		
	}
	else{
		console.log("else part");
		id=req.query.id;
	}

	console.log("end----------------================")
	console.log("ID IS ______________--------------"+id);
	Audio.findById(mongoose.mongo.ObjectId(id),
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
server.post('/addLiveDarshan',authnjwt, function(req, res, next) {
	
    let data = req.body || {}
	console.log(data)
	data={
		"title":req.body.title,
		"date":req.body.date,
		"time":req.body.time,
		"venue":req.body.venue,
		"videoPath":req.body.videoPath,
		"desc":req.body.desc
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
server.post('/removeLiveDarshan',authnjwt, function(req, res, next) {
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
server.post('/updateLiveDarshan',authnjwt,function(req, res, next){
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
			live.date=req.body.date
			live.time=req.body.time
			live.venue=req.body.venue
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

server.post('/addEvent',authnjwt, function(req, res, next) {
	
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
server.post('/removeEvent',authnjwt, function(req, res, next) {
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

server.post('/updateEvent',authnjwt,function(req, res, next){
	console.log("updating event" + req.body.id)
	
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
					events.desc =  req.body.desc
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
	
})

server.post('/updateEventold',authnjwt,function(req, res, next){
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
server.post('/addNews',authnjwt, function(req, res, next) {
	
	uploadNews(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
			let data = {}
			if(typeof (req.file) !="undefined"){
				console.log("inside exisitng part");
				data={
					'title':req.body.title,
					'desc':req.body.desc,
					'date':req.body.date,
					'imagePath':req.file.path ||{}
				}
			}
			else{
				data={
					'title':req.body.title,
					'desc':req.body.desc,
					'date':req.body.date,
					'imagePath':''
				}
			}
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
		}	
	});
	
	
	

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
server.post('/removeNews',authnjwt, function(req, res, next) {
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
server.post('/updateNews',authnjwt,function(req, res, next){
	console.log("updating news")
	console.log("start----------------================")
	let id=null;
	console.log(req);
	if(typeof req.query.id=="undefined"){
		console.log("inside if ");
		id=req.body.id;
		
	}
	else{
		console.log("else part");
		id=req.query.id;
	}

	console.log("end----------------================")
	console.log("ID IS ______________--------------"+id);
	News.findById(mongoose.mongo.ObjectId(id),
	function(err,news){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating")
			
			uploadNews(req,res,function(err) {
				if(err) {
					return res.end(err+" Error uploading file.");
				}
				else {
					console.log(req.file);	
					console.log(req.body);
					
					news.title=req.body.title
					news.desc=req.body.desc
					news.date=req.body.date
					if(req.file!=null)
						news.imagePath=req.file.path
					
					
					console.log(news)

					news.save(function(err) {

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

/*----------------------------------------------------------------------------------------------------*/

server.post('/addCentre',authnjwt, function(req, res, next) {
	
    let data = req.body || {}
	console.log("adding centre",data)
	data={
		"address":req.body.address,
		"city":req.body.city,
		"state":req.body.state,
		"country":req.body.country,
		"pin":req.body.pin,
		"latitude":req.body.latitude,
		"longitude":req.body.longitude,
	}

    let centre = new Centre(data)
	console.log(centre)
    
	 centre.save(function(err) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201,"ADDED")
        next()

    })

})

server.post('/centres', function(req, res, next) {
	console.log("Sending centre");
	let data = req.body || {}
	let index = 0
	if(data!=null)
		index=data.index
	Centre.find(
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

/*---------------------------------------------------------------------------------------------------------------*/
server.post('/addArticle',function(req, res, next) {
	console.log("adding article")
	uploadArticle(req,res,function(err) {
		if(err) {
			return res.end(err+" Error uploading file.");
		}
		else {
			console.log(req.file);	
			console.log(req.body);
			let data={}
			if(req.file!=null){ 
				data={
					'title':req.body.title,
					'imagePath':req.file.path || {},
					'desc':req.body.desc
				}
			}
			else{
				data={
					'title':req.body.title,
					'imagePath':'',
					'desc':req.body.desc
				}
			}
			
			let article = new Article(data)
			console.log(article)
			
			article.save(function(err) {

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

	
server.post('/articles', function(req, res, next) {
	console.log("Sending articles");
	Article.find(
	{},
	[],
	{
		skip:0 // Starting Row
		//limit:10, // Ending Row
		
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
server.post('/getArticleDetails', function(req, res, next) {
	console.log("Sending article details");
	Article.findById(mongoose.mongo.ObjectId(req.body.id),
	function(err, doc) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
		console.log("article doc is"+doc);
		if(doc!=null)
			res.send(doc)
        else
			res.send(200,"Not found")
		next()

    })

})

server.post('/removeArticle',authnjwt, function(req, res, next) {
	console.log("removing articles");
	Article.findByIdAndRemove(mongoose.mongo.ObjectId(req.body.id),
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

server.post('/updateArticle',authnjwt,function(req, res, next){
	console.log("updating article")
	console.log("start----------------================")
	let id=null;
	console.log(req);
	if(typeof req.query.id=="undefined"){
		console.log("inside if ");
		id=req.body.id;
		
	}
	else{
		console.log("else part");
		id=req.query.id;
	}

	console.log("end----------------================")
	console.log("ID IS ______________--------------"+id);
	Article.findById(mongoose.mongo.ObjectId(id),
	function(err,article){
		if(err!=null){
			log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
		}
		else{
			console.log("updating")
			
			uploadArticle(req,res,function(err) {
				if(err) {
					return res.end(err+" Error uploading file.");
				}
				else {
					console.log(req.file);	
					console.log(req.body);
					
					article.title=req.body.title
					article.desc=req.body.desc
					if(req.file!=null)
						article.imagePath=req.file.path 
					
					
					console.log(article)

					article.save(function(err) {

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

server.post('/countArticles', function(req, res, next) {
	console.log("counting articles");
	Article.count({},
	function(err,count) {

        if (err!=null) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }
        else{
			console.log("Article count is:",count)
		}
			res.send(200,count)
		next()

    })

})

