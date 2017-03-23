global.Promise = require('bluebird');
const express = require('express');
const app = module.exports = express();
const cors = require('cors');
const debug = require('debug')('app:server');
const {compare} = require('bcrypt');
const {json, urlencoded} = require('body-parser');

if (app.get('env') !== 'testing') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

if (app.get('env') === 'production') {
  const helmet = require('helmet');
  app.use(helmet());
}

app.use(cors());
app.use(json());
app.use(urlencoded({extended: false}));

app.get('/proof-of-work', function({body}, response, next) {
  const text = body.text;
  const hash = body.hash;

  compare(text, hash)
    .then((ok) => ok ? 'Work is proven!' : 'Work not proven!')
    .then(response.send.bind(response))
    .catch(next);
});

app.use(function(err, request, response, next) {
  response
    .status(500)
    .send('Server error!');
});

if (require.main === module) {
  app.listen(3000, function() {
    debug('JSLab 2017 demo app listening on port 3000!');
  });

  process.once('SIGTERM', function() {
    debug('Server going to be down!');
    app.close((err) => err ? process.exit(1) : process.exit(0));
  });
}
