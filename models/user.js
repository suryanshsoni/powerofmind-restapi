'use strict'

const mongoose = require('mongoose'),
	  mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin,
	  crypto = require('crypto'),
	  jwt = require('jsonwebtoken'),
	  config=require('../config');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  loggedIn: Boolean,
  token:String
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  var secret = config.MY_SECRET ;
  console.log('secret',secret)
  var token = jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, secret); // DO NOT KEEP YOUR SECRET IN THE CODE!

		return token;
};
UserSchema.methods.setLoggedIn = function(token) {
  this.loggedIn=true;
  this.token=token;
  this.save()
  return true;
};
UserSchema.plugin(mongooseApiQuery)
UserSchema.plugin(createdModified, { index: true })
const User = mongoose.model('User', UserSchema)
module.exports = User



