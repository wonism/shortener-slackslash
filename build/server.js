'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _createShortUrls = require('./utils/createShortUrls');

var _createShortUrls2 = _interopRequireDefault(_createShortUrls);

var _slashCommand = require('./utils/slashCommand');

var _slashCommand2 = _interopRequireDefault(_slashCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _express2.default();
app.use(_bodyParser2.default.urlencoded({ extended: true }));

var _process$env = process.env,
    slackToken = _process$env.SLACK_TOKEN,
    apiKey = _process$env.REBRANDLY_APIKEY,
    PORT = _process$env.PORT;


if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY');

  process.exit(1);
}

var port = PORT || 80;
var rebrandlyClient = (0, _createShortUrls2.default)(apiKey);
var slashCommand = (0, _slashCommand2.default)(rebrandlyClient, slackToken);

app.post('/', function (req, res) {
  slashCommand(req.body).then(function (result) {
    return res.json(result);
  }).catch(console.error);
});

app.listen(port, function () {
  console.log('Server started at localhost:' + port);
});