var CONFIG = require('./config');
var lti = require('ims-lti');
var strategy = require('./../lib/strategy');
var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('Strategy', function() {

  describe('handling error in provider validation', function() {
    var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);

    var SUT = strategy(() => { throw new Error('error in provider validation');}, CONFIG.lti);

    var req = {
      body: CONFIG.body(),
      protocol: 'http',
      url: 'http://someUrl',
      method: 'POST',
      headers: {
        host: 'somehost'
      }
    };

    req.body.oauth_signature = provider.signer.build_signature(req, req.body, CONFIG.lti.consumerSecret);
    it('should return a provider error', async function () {
      var result = await SUT.authenticate(req);
      expect(result.details.error).to.be.an.instanceof(Error);
      expect(result.details.error.message).to.equal('error in provider validation');
    });
  });
  
  describe('handling a request with invalid oauth signature', function() {
    var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);
    var SUT = strategy(() => { return null;}, CONFIG.lti);

    var req = {
      body: CONFIG.body(),
      protocol: 'http',
      url: 'http://someUrl',
      method: 'POST',
      headers: {
        host: 'somehost'
      }
    };
    req.body.oauth_signature = 'incorrect sig';

    it('should return a SignatureError', async function () {
      var result = await SUT.authenticate(req);
      expect(result.details.error).to.be.an.instanceof(lti.Errors.SignatureError);
    });
  });

});
