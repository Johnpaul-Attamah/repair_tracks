"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var url = '';

if (process.env.NODE_ENV.trim() === 'production') {
  url = process.env.PROD_DB_URI;
}

if (process.env.NODE_ENV.trim() === 'test') {
  url = process.env.TEST_DB_URI;
}

if (process.env.NODE_ENV.trim() === 'development') {
  url = process.env.DEV_DB_URI;
}

var _default = url;
exports["default"] = _default;