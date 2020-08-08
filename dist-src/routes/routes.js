"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../controllers/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = function router(app) {
  app.use('/api/v1/auth', _user["default"]);
  app.use(function (req, res, next) {
    res.status(200).json({
      greetings: 'Welcome to repairs_tracks'
    });
  });
};

var _default = router;
exports["default"] = _default;