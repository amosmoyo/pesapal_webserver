const express = require("express");


const {
  register,
  login,
  welcome,
  registerForm,
  loginForm,
  dashboard,
  passportAuth,
  logout,
} = require("../controller/auth");

const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("../configs/auth");

const router = express.Router();

router.route("/").get(forwardAuthenticated, welcome);
router
  .route("/register")
  .get(forwardAuthenticated, registerForm)
  .post(register);
router.route("/login").get(forwardAuthenticated, loginForm).post(passportAuth);
router.route("/dashboard").get(ensureAuthenticated, dashboard);
router.route("/logout").get(logout);

module.exports = router;
