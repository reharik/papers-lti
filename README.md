# papers-lti
[![Build Status](https://travis-ci.org/reharik/papers-lti.svg)](https://travis-ci.org/reharik/papers-lti)
[![Code Climate](https://codeclimate.com/github/reharik/papers-lti/badges/gpa.svg)](https://codeclimate.com/github/reharik/papers-lti)
[![Test Coverage](https://codeclimate.com/github/reharik/papers-lti/badges/coverage.svg)](https://codeclimate.com/github/reharik/papers-lti/coverage)

Passport-flavored LTI authentication middleware for express.

## LTIStrategy

Options : 
-  `createProvider` :
	`createProvider` is an optional function, which delegate the check of a
	Tool Consumer's identity to an higher level.

	This function is assumed to request a database to retrieve 
	the consumer secret based on the consumer key,
	and call the callback parameter with an LTI provider, 
	or a standard node error in `err` if a system error occured,
	or a string error if the error is handled at an higher level, 
	and the process is just intended to stop.
	Use either this function or the hardcoded key / secret. 
	This one gets priority over the hardcoded key / secret.
	```
	@param {Function} createProvider 
		@param {Object} req
		@param {Function} callback
			@param {Object || String} err
			@param {Object} provider
	```
- `consumerKey` : Hardcoded consumer key.
- `consumerSecret` : Hardcoded consumer secret.

## Usage

### With hardcoded key / secret

```javascript
var papers = require('papers');
var LTIStrategy = require('papers-lti');
var strategy = new LTIStrategy({
	consumerKey: 'testconsumerkey',
	consumerSecret: 'testconsumersecret'
	// pass the req object to callback
	// passReqToCallback: true,
	// https://github.com/omsmith/ims-lti#nonce-stores
	// nonceStore: new RedisNonceStore('testconsumerkey', redisClient)
}, function(lti, done) {
	// LTI launch parameters
	// console.dir(lti);
	// Perform local authentication if necessary
	return done(null, user);
});
papers.use(strategy);
```

### With dynamic provider

```javascript
var papers = require('papers');
var lti = require("ims-lti");
var LTIStrategy = require('papers-lti');
var strategy = new LTIStrategy({
	createProvider : function (req, done) {
		// Lookup your LTI customer in your DB with req's params, and get its secret
		// Dummy DB lookup
		DAO.getConsumer(
			req.body.oauth_consumer_key,
			function callback (err, consumer){
				if(err){
					// Standard error, will crash the process
					return done(err);
				}
	
				if(consumer.is_authorized){
					var consumer = new lti.Provider(consumer_db.oauth_consumer_key, consumer_db.oauth_consumer_secret);
					return done(null, consumer);
				}
				else {
					// String error, will fail the strategy (and not crash it)
					return done("not_authorized");
				}
	    	}
		);
	}
);

papers.use(strategy);
```
## Tests

```shell
$ npm test
```
