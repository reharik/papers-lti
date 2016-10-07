var lti = require('ims-lti');
var co = require('co');
/**
  * LTI-based authentication strategy.
  * 
  * Options : 
  *  -  `createProvider` :
  *    `createProvider` is an optional function, which delegate the check of a
  *    Tool Consumer's identity to an higher level.
  *    This function is assumed to request a database to retrieve 
  *    the consumer secret based on the consumer key,
  *    and call the callback parameter with an LTI provider, 
  *    or a standard node error in `err` if a system error occured,
  *    or a string error if the error is handled at an higher level, 
  *    and the process is just intended to stop.
  *
  *    Use either this function or the hardcoded key / secret. 
  *    This one gets priority over the hardcoded key / secret.
  *
  *    @param {Function} createProvider 
  *      @param {Object} req
  *      @param {Function} callback
  *        @param {Object || String} err
  *        @param {Object} provider
  *    
  *  - `consumerKey` : Hardcoded consumer key.
  *  - `consumerSecret` : Hardcoded consumer secret.
*/

const strategy = function(validate, options) {

  // If it's intended to check tool consumer's identity from database
  // Dev will pass a function that handle it
  // This will get called when the request authenticates
  // And the LTI Provider will be defined at this time, for each request
  // Else, we assume we're in a development environment,
  // thus there's only one test consumer
  if (typeof options.createProvider !== "function") {
    // Instantiate the provider from there, with hardcoded key & secret
    var provider = new lti.Provider(options.consumerKey,
      options.consumerSecret,
      options.nonceStore);
    options.createProvider = function (req, cb) {
      cb(null, provider)
    }
  }

  const authenticate = function (req) {
    if (req.body.lti_message_type !== 'basic-lti-launch-request') {
      return {type: 'fail', details: {error: `Request isn't LTI launch`}};
    }

    // Check consumer's identity with strategy's predefined database access function

    return co(function *() {
      const provider = yield new Promise((res, rej) => {
        options.createProvider(req, function (err, provider) {
          if (err) {
            throw err;
          }
          return res(provider);
        })
      });

      const isValid = yield new Promise((res, rej) => {
        provider.valid_request(req, function (err, valid) {
          if (err) {
            throw err;
          }
          return res(valid);
        })
      });
      if (!isValid) {
        throw new Error();
      }
      var user = yield validate(req, provider.body);
      if (!user) return {type: 'fail', details: {error: 'invalid credentials'}};
      return {type: 'success', details: {user}}
    }).catch(ex => {
        return {type: 'error', details: {error: ex}}
      })
  };
  
  return {
    authenticate
  }
};

module.exports = strategy;
