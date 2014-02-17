var Mongolian = require('mongolian'),
	ObjectId= Mongolian.ObjectId;

ObjectId.prototype.toJSON = function(){ return this.toString() };

var server = new Mongolian();

var db = server.db('twitter');

module.exports.ObjectId = ObjectId;
module.exports.collections = {
	tweets: db.collection('tweets')
};