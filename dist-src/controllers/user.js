"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _gravatar = _interopRequireDefault(require("gravatar"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _User = _interopRequireDefault(require("../models/User"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _register = _interopRequireDefault(require("./../validations/register"));

var _login = _interopRequireDefault(require("./../validations/login"));

require("regenerator-runtime/runtime.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();
/**
 * use regenerator runtime to enable 
 * babel transplilng async await and generators.
 */


var router = _express["default"].Router();
/**
 * Register a user
 * @function
 * @param {Object} req Request object to create user requests
 * @param {Object} res Response object to get user details or error
 * @param {Object} error Object to display error messages.
 */


router.post('/register', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _validateRegisterInpu, errors, isValid, userInDB, avatar, newUser;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _validateRegisterInpu = (0, _register["default"])(req.body), errors = _validateRegisterInpu.errors, isValid = _validateRegisterInpu.isValid;

            if (isValid) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              status: 'failed',
              errors: errors
            }));

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return _User["default"].findOne({
              email: req.body.email
            });

          case 6:
            _context2.t0 = _context2.sent;

            if (_context2.t0) {
              _context2.next = 11;
              break;
            }

            _context2.next = 10;
            return _User["default"].findOne({
              username: req.body.username
            });

          case 10:
            _context2.t0 = _context2.sent;

          case 11:
            userInDB = _context2.t0;

            if (!userInDB) {
              _context2.next = 18;
              break;
            }

            if (userInDB.email === req.body.email) errors.email = 'email exists.';
            if (userInDB.username === req.body.username) errors.username = 'username exists.';
            return _context2.abrupt("return", res.status(422).json({
              status: 'success',
              errors: errors
            }));

          case 18:
            avatar = _gravatar["default"].url(req.body.email, {
              s: '200',
              r: 'pg',
              d: 'mm'
            });
            newUser = new _User["default"]({
              username: req.body.username,
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              avatar: avatar
            });

            _bcryptjs["default"].genSalt(10, function (err, salt) {
              _bcryptjs["default"].hash(newUser.password, salt, function (err, hash) {
                if (err) throw err;
                newUser.password = hash;

                _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var user;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return newUser.save();

                        case 2:
                          user = _context.sent;
                          return _context.abrupt("return", res.status(201).json({
                            status: 'Success',
                            message: 'User Created Successfully',
                            user: user
                          }));

                        case 4:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }))()["catch"](function (err) {
                  return err;
                });
              });
            });

          case 21:
            _context2.next = 26;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t1 = _context2["catch"](3);
            res.status(500).json(_context2.t1);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 23]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
/**
 * Login a user
 * @function
 * @param {Object} req Request object to make user login requests
 * @param {Object} res Response object to get user details or error
 * @param {Object} error Object to display error messages.
 */

router.post('/login', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _validateLoginInput, errors, isValid, _req$body, inputValue, password, user, isMatch, payload;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _validateLoginInput = (0, _login["default"])(req.body), errors = _validateLoginInput.errors, isValid = _validateLoginInput.isValid;

            if (isValid) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              status: 'failed',
              errors: errors
            }));

          case 3:
            _req$body = req.body, inputValue = _req$body.inputValue, password = _req$body.password;
            _context3.prev = 4;

            if (!/\S+@\S+\.\S+/.test(inputValue)) {
              _context3.next = 11;
              break;
            }

            _context3.next = 8;
            return _User["default"].findOne({
              email: inputValue
            });

          case 8:
            _context3.t0 = _context3.sent;
            _context3.next = 14;
            break;

          case 11:
            _context3.next = 13;
            return _User["default"].findOne({
              username: inputValue
            });

          case 13:
            _context3.t0 = _context3.sent;

          case 14:
            user = _context3.t0;

            if (user) {
              _context3.next = 18;
              break;
            }

            errors.inputValue = 'email or username not found.';
            return _context3.abrupt("return", res.status(404).json({
              status: 'success',
              errors: errors
            }));

          case 18:
            _context3.next = 20;
            return _bcryptjs["default"].compare(password, user.password);

          case 20:
            isMatch = _context3.sent;

            if (!isMatch) {
              _context3.next = 26;
              break;
            }

            payload = {
              id: user.id,
              role: user.role,
              username: user.username,
              name: user.name,
              avatar: user.avatar
            };

            _jsonwebtoken["default"].sign(payload, process.env.SECRET_OR_KEY, {
              expiresIn: 3600
            }, function (err, token) {
              return res.status(200).json({
                status: 'success',
                message: 'You are logged in!',
                token: 'Bearer ' + token
              });
            });

            _context3.next = 28;
            break;

          case 26:
            errors.password = 'password incorrect';
            return _context3.abrupt("return", res.status(401).json({
              status: 'failed',
              errors: errors
            }));

          case 28:
            _context3.next = 33;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t1 = _context3["catch"](4);
            res.status(500).json(_context3.t1);

          case 33:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 30]]);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;