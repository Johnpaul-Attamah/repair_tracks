"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("./isEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var validateLoginInput = function validateLoginInput(data) {
  var errors = {};
  data.inputValue = !(0, _isEmpty["default"])(data.inputValue) ? data.inputValue : '';
  data.password = !(0, _isEmpty["default"])(data.password) ? data.password : '';

  if (_validator["default"].isEmpty(data.inputValue)) {
    errors.inputValue = 'Username or email is required';
  }

  if (_validator["default"].isEmpty(data.password)) {
    errors.password = 'password field is required';
  }

  return {
    errors: errors,
    isValid: (0, _isEmpty["default"])(errors)
  };
};

var _default = validateLoginInput;
exports["default"] = _default;