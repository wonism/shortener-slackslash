'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createErrorDescription = function createErrorDescription(code, err) {
  switch (code) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized: Be sure you configured the integration to use a valid API key';
    case 403:
      return 'Invalid request: ' + err.source + ' ' + err.message;
    case 404:
      return 'Not found: ' + err.source + ' ' + err.message;
    case 503:
      return 'Short URL service currently under maintenance. Retry later';
    default:
      return 'Unexpected error connecting to Rebrandly APIs';
  }
};

var createError = function createError(sourceUrl, err) {
  var errorDescription = createErrorDescription(err.statusCode, JSON.parse(err.body));

  return new Error('Cannot create short URL for "' + sourceUrl + '": ' + errorDescription);
};

var createShortUrlFactory = function createShortUrlFactory(apikey) {
  return function (options) {
    return new Promise(function (resolve, reject) {
      var body = {
        destination: options.url,
        domain: options.domain ? { fullName: options.domain } : undefined,
        slashtag: options.slashtag ? options.slashtag : undefined
      };

      var req = (0, _requestPromiseNative2.default)({
        url: 'https://api.rebrandly.com/v1/links',
        method: 'POST',
        headers: {
          apikey: apikey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body, null, 2),
        resolveWithFullResponse: true
      });

      req.then(function (res) {
        var result = JSON.parse(res.body);

        return resolve(result);
      }).catch(function (err) {
        return resolve(createError(options.url, err.response));
      });
    });
  };
};

var createShortUrlsFactory = function createShortUrlsFactory(apikey) {
  return function (urls, domain, slashtags) {
    var structuredUrls = urls.map(function (url) {
      return { url: url, domain: domain, slashtag: undefined };
    });

    if (Array.isArray(slashtags)) {
      slashtags.forEach(function (slashtag, i) {
        return structuredUrls[i].slashtag = slashtag;
      });
    }

    var requestsPromise = structuredUrls.map(createShortUrlFactory(apikey));

    return Promise.all(requestsPromise);
  };
};

exports.default = createShortUrlsFactory;