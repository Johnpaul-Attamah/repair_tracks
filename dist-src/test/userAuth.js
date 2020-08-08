"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _server = _interopRequireDefault(require("../server"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var should = _chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

describe('Users', function () {
  before(function (done) {
    _User["default"].deleteMany({}, function (err) {
      done();
    });
  });
  /*
   * Test the /POST route
   */

  describe('/POST new User', function () {
    it('it should not register a user without username field', function (done) {
      var user = {
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('username').eql('Username field is required');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user without a name field', function (done) {
      var user = {
        username: 'Johnson123',
        email: 'johnson@email.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name').eql('Name field is required');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user without an Email field', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('email').eql('Email is invalid');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user with wrong email field', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johnsonemail.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('email').eql('Email is invalid');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user without password field', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('password').eql('password field is required');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user with wrong password combinations', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password: 'tohny78',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('password').eql("Password must contain 8 to 15 characters \n      and must contain at least one lowercase letter\n      one uppercase letter and at least a number");
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should not register a user without confirm password field', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('password2').eql('Passwords must match');
        res.body.should.have.property('status').eql('failed');
        done();
      });
    });
    it('it should register a user', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User Created Successfully');
        res.body.should.have.property('status').eql('Success');
        done();
      });
    });
    it('it should not register a user with existing email', function (done) {
      var user = {
        username: 'Johncena123',
        name: 'Johnson Peters',
        email: 'johnson@email.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('email').eql('email exists.');
        res.body.should.have.property('status').eql('success');
        done();
      });
    });
    it('it should not register a user with existing username', function (done) {
      var user = {
        username: 'Johnson123',
        name: 'Johnson Peters',
        email: 'johncena@email.com',
        password: 'johnSON2020',
        password2: 'johnSON2020'
      };

      _chai["default"].request(_server["default"]).post('/api/v1/auth/register').send(user).end(function (err, res) {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('username').eql('username exists.');
        res.body.should.have.property('status').eql('success');
        done();
      });
    });
  });
});
describe('POST /auth/login', function () {
  it('It should login user with email and asign token', function (done) {
    var user = {
      inputValue: 'johnson@email.com',
      password: 'johnSON2020'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('message').eql('You are logged in!');
      res.body.should.have.property('token').be.a('string');
      done();
    });
  });
  it('It should login user with username and asign token', function (done) {
    var user = {
      inputValue: 'Johnson123',
      password: 'johnSON2020'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('message').eql('You are logged in!');
      res.body.should.have.property('token').be.a('string');
      done();
    });
  });
  it('It should not login user when email/username field missing', function (done) {
    var user = {
      password: 'johnSON2020'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.should.have.property('status').eql('failed');
      res.body.errors.should.have.property('inputValue').eql('Username or email is required');
      done();
    });
  });
  it('It should not login user when password field missing', function (done) {
    var user = {
      inputValue: 'Johnson123'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.should.have.property('status').eql('failed');
      res.body.errors.should.have.property('password').eql('password field is required');
      done();
    });
  });
  it('It should not login user, when email mismatch', function (done) {
    var user = {
      inputValue: 'Johncena@email.com',
      password: 'johnSON2020'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('inputValue').eql('email or username not found.');
      res.body.should.have.property('status').eql('success');
      done();
    });
  });
  it('It should not login user, when username mismatch', function (done) {
    var user = {
      inputValue: 'Johncena123',
      password: 'johnSON2020'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('inputValue').eql('email or username not found.');
      res.body.should.have.property('status').eql('success');
      done();
    });
  });
  it('It should not login user, when password mismatch', function (done) {
    var user = {
      inputValue: 'Johnson123',
      password: 'mypassword'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send(user).end(function (err, res) {
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('password').eql('password incorrect');
      res.body.should.have.property('status').eql('failed');
      done();
    });
  });
});