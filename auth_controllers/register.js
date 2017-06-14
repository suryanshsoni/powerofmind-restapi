var passport = require('./passport');
var mongoose = require('mongoose');
var User = require('../models/user');

module.exports.register = function(req, res) {
  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);
  user.save(function(err) {
	if (err!=null) {
		log.error(err)
		return next(new errors.InternalError(err.message))
		next()
	}
    var token;
    token = user.generateJwt();
    res.status(200);
	res.session=token;
    res.json({
      "token" : token,
	  "id":user._id,
	  "status":true
    });
  });
};