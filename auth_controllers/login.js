var mongoose = require('mongoose');
var User = require('../models/user');
var passport=require('passport-restify')
module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.send(404,{"err":err,"status":false});
      return;
    }

    // If a user is found
    if(user){
		token = user.generateJwt();
		var state = user.setLoggedIn(token);
		if(state==true){
			res.status(200);
			res.session=token;
			res.json({
			  "token" : token,
			  "id":user._id,
			  "status":true
			});	
	}
		  
    } else {
      // If user is not found
      res.send(401,{"err":info,"status":false});
    }
  })(req,res);

};