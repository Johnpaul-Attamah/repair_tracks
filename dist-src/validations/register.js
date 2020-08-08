"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("./isEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var validateRegisterInput = function validateRegisterInput(data) {
  var errors = {};
  data.username = !(0, _isEmpty["default"])(data.username) ? data.username : '';
  data.name = !(0, _isEmpty["default"])(data.name) ? data.name : '';
  data.email = !(0, _isEmpty["default"])(data.email) ? data.email : '';
  data.password = !(0, _isEmpty["default"])(data.password) ? data.password : '';
  data.password2 = !(0, _isEmpty["default"])(data.password2) ? data.password2 : '';

  if (!_validator["default"].isLength(data.username, {
    min: 3,
    max: 15
  })) {
    errors.username = 'Username must be between 3 and 15 characters';
  }

  if (!_validator["default"].isAlphanumeric(data.username)) {
    errors.username = 'Username must contain letters or numbers or both';
  }

  if (!_validator["default"].isLength(data.name, {
    min: 2,
    max: 30
  })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (_validator["default"].isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (_validator["default"].isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (_validator["default"].isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!_validator["default"].isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!_validator["default"].matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)) {
    errors.password = "Password must contain 8 to 15 characters \n      and must contain at least one lowercase letter\n      one uppercase letter and at least a number";
  }

  if (_validator["default"].isEmpty(data.password)) {
    errors.password = 'password field is required';
  }

  if (_validator["default"].isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!_validator["default"].equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors: errors,
    isValid: (0, _isEmpty["default"])(errors)
  };
};

var _default = validateRegisterInput;
exports["default"] = _default;