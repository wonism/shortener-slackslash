'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandParser2 = require('./commandParser');

var _commandParser3 = _interopRequireDefault(_commandParser2);

var _validateCommandInput = require('./validateCommandInput');

var _validateCommandInput2 = _interopRequireDefault(_validateCommandInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createErrorAttachment = function createErrorAttachment(error) {
  return {
    color: 'danger',
    text: '*Error*:\n' + error.message,
    mrkdwn_in: ['text']
  };
};

var createSuccessAttachment = function createSuccessAttachment(link) {
  return {
    color: 'good',
    text: '*<http://' + link.shortUrl + '|' + link.shortUrl + '>* (<https://www.rebrandly.com/links/' + link.id + '|edit>):\n' + link.destination,
    mrkdwn_in: ['text']
  };
};

var createAttachment = function createAttachment(result) {
  if (result.constructor === Error) {
    return createErrorAttachment(result);
  }

  return createSuccessAttachment(result);
};

var slashCommandFactory = function slashCommandFactory(createShortUrls, slackToken) {
  return function (body) {
    return new Promise(function (resolve, reject) {
      if (!body) {
        return resolve({
          text: '',
          attachments: [createErrorAttachment(new Error('Invalid body'))]
        });
      }

      if (slackToken !== body.token) {
        return resolve({
          text: '',
          attachments: [createErrorAttachment(new Error('Invalid token'))]
        });
      }

      var _commandParser = (0, _commandParser3.default)(body.text),
          urls = _commandParser.urls,
          domain = _commandParser.domain,
          slashtags = _commandParser.slashtags;

      var error = null;

      if (error = (0, _validateCommandInput2.default)(urls, domain, slashtags)) {
        return resolve({
          text: '',
          attachments: [createErrorAttachment(error)]
        });
      }

      createShortUrls(urls, domain, slashtags).then(function (result) {
        return resolve({
          text: result.length + ' link(s) processed',
          attachments: result.map(createAttachment)
        });
      });
    });
  };
};

exports.default = slashCommandFactory;