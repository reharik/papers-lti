// var CONFIG = require('./config');
// var lti = require('ims-lti');
// var strategy = require('./../lib/strategy');
// var chai = require('chai');
// var expect = chai.expect;
// chai.should();
//
// describe('Strategy', function() {
//
//   describe('handling a request with unknown user and no info', function() {
//     var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);
//     var SUT = strategy(() => { return null;}, CONFIG.lti);
//     var req = {
//       body: CONFIG.body(),
//       protocol: 'http',
//       url: 'http://someUrl',
//       method: 'POST',
//       headers: {
//         host: 'somehost'
//       }
//     };
//
//     req.body.oauth_signature = provider.signer.build_signature(req, req.body, CONFIG.lti.consumerSecret);
//
//     it('should fail', function() {
//       expect(info).to.be.undefined;
//     });
//   });
//
//   describe('handling a request with unknown user and info message', function() {
//     var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);
//     var strategy = new Strategy(CONFIG.lti, function(lti, done) {
//       return done(null, false, {
//         message: 'authentication failed'
//       });
//     });
//
//     var info;
//
//     before(function(done) {
//       chai.passport.use(strategy)
//       .fail(function(i) {
//         info = i;
//         done();
//       })
//       .req(function(req) {
//         req.body = CONFIG.body();
//         req.protocol = 'http';
//         req.get = function() {
//           return 'test-get';
//         };
//         req.body.oauth_signature = provider.signer.build_signature(req, req.body, CONFIG.lti.consumerSecret);
//       })
//       .authenticate();
//     });
//
//     it('should fail with correct info message', function() {
//       expect(info).to.be.an('object');
//       expect(info.message).to.be.equal('authentication failed');
//     });
//   });
//
//   describe('handling a request that is not an LTI launch', function() {
//     var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);
//     var strategy = new Strategy(CONFIG.lti, function(lti, done) {
//       return done(null, false);
//     });
//
//     var info;
//
//     before(function(done) {
//       chai.passport.use(strategy)
//       .fail(function(i) {
//         info = 'failure called';
//         done();
//       })
//       .req(function(req) {
//         req.body = CONFIG.body();
//         req.protocol = 'http';
//         req.body.lti_message_type = 'not-lti-launch-request';
//         req.get = function() {
//           return 'test-get';
//         };
//       })
//       .authenticate();
//     });
//
//     it('should fail', function() {
//       expect(info).to.equal('failure called');
//     });
//   });
//
// });
