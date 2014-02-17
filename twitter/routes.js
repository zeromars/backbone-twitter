
var home = require('./controllers/home'),
	tweets = require('./controllers/tweets');
/*
 * GET home page.
 */

module.exports = function(app){
	app.get('/', home.index);	

  	app.get('/tweets', tweets.index);

	//CRUD
	app.get('/tweets', tweets.index);
	app.post('/tweets', tweets.create);
	app.get('/tweets/:id', tweets.show);
	app.put('/tweets/:id', tweets.update);
	app.delete('/tweets/:id', tweets.destroy);
};