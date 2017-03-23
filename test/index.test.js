const app = require('../src');
const request = require('supertest');
const {hashSync} = require('bcrypt');

describe('Proof of work server', function() {
  describe('POST /proof-of-work', function() {
    it('responds with error if hash is not correct', function(done) {
      request(app)
        .get('/proof-of-work')
        .set('Accept', 'text/plain')
        .send({
          text: 'fpo',
          hash: 'bar',
        })
        .expect('Content-Type', /text/)
        .expect(200, function(err, response) {
          response.text.should.match(/Work not proven!/);
          done(err);
        });
    });

    it('responds with success if hash is correct', function(done) {
      const text = 'username';
      const hash = hashSync(text, 10);

      request(app)
        .get(`/proof-of-work`)
        .set('Accept', 'text/plain')
        .send({
          text,
          hash,
        })
        .expect('Content-Type', /text/)
        .expect(200, function(err, response) {
          response.text.should.match(/Work is proven!/);
          done(err);
        });
    });
  });
});
