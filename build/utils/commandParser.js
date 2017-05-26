'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringTokenizer = require('string-tokenizer');

var _stringTokenizer2 = _interopRequireDefault(_stringTokenizer);

var _urlRegex = require('url-regex');

var _urlRegex2 = _interopRequireDefault(_urlRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arrayOrUndefined = function arrayOrUndefined(data) {
  if (typeof data === 'undefined' || Array.isArray(data)) {
    return data;
  }

  return [data];
};

var commandParser = function commandParser(commandText) {
  var tokens = (0, _stringTokenizer2.default)().input(commandText).token('url', (0, _urlRegex2.default)()).token('domain', /(?:@)((?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*\.[a-z\\u00a1-\\uffff]{2,})/, function (match) {
    return match[2];
  }).token('slashtag', /(?:~)(\w{2,})/, function (match) {
    return match[2];
  }).resolve();

  return {
    urls: arrayOrUndefined(tokens.url),
    domain: tokens.domain,
    slashtags: arrayOrUndefined(tokens.slashtag)
  };
};

exports.default = commandParser;