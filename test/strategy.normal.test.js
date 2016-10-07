var CONFIG = require('./config');
var lti = require('ims-lti');
var strategy = require('./../lib/strategy');
var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('Strategy', function() {
  describe('handling a request with valid LTI credentials', function() {
    var provider = new lti.Provider(CONFIG.lti.consumerKey, CONFIG.lti.consumerSecret);
    var SUT = strategy(() => { return { id: '1234' } }, CONFIG.lti);

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

    it('should supply user', async function() {
      var result = await SUT.authenticate(req);
      expect(result.details.user).to.be.an.object;
      expect(result.details.user.id).to.equal('1234');
    });

    it.skip('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info).to.deep.equal({
        scope: 'read'
      });
    });
  });

  describe('handle dynamic oauth secrets', function() {
    // example createProvider, you might end up looking instituion, etc to find the shared secrets
    function createProvider(req, cb) {
      cb(null, new lti.Provider(req.body.consumerKey, req.body.consumerSecret));
    }

    var SUT = strategy(() => { return { id: '1234' } }, {createProvider: createProvider});
    var req = {
      body: CONFIG.body(),
      protocol: 'http',
      url: 'http://someUrl',
      method: 'POST',
      headers: {
        host: 'somehost'
      }
    };
    req.body.consumerSecret = CONFIG.lti.consumerSecret;
    req.body.consumerKey = CONFIG.lti.consumerKey;
    var provider = new lti.Provider(req.body.consumerKey, req.body.consumerSecret);
    req.body.oauth_signature = provider.signer.build_signature(req, req.body, CONFIG.lti.consumerSecret);

    it('should supply user', async function() {
      var result = await SUT.authenticate(req);
      expect(result.details.user).to.be.an.object;
      expect(result.details.user.id).to.equal('1234');
    });

    it.skip('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info).to.deep.equal({
        scope: 'read'
      });
    });
  });
});
