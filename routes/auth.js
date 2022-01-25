const express = require("express");
const passport = require("passport-local");

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
router
  .route("/login")
  .get(forwardAuthenticated, loginForm)
  .post(
    // passport.authenticate('local', {
    //   successRedirect: '/dashboard',
    //   failureRedirect: '/users/login',
    //   failureFlash: true
    // })(req, res, next)
    // passportAuth
    // passport.authenticate("local", {
    //   successRedirect: "/dashboard",
    //   failureRedirect: "/users/login",
    //   failureFlash: true,
    // }),
    // function (req, res) {
    //   res.redirect("/");
    // }

    // (req, res, next) => {
    //   passport.authenticate('local', {
    //     successRedirect: '/dashboard',
    //     failureRedirect: '/users/login',
    //     failureFlash: true
    //   })(req, res, next);
    // }

    login
  );
router.route("/dashboard").get(ensureAuthenticated, dashboard);
router.route("/logout").get(logout);

module.exports = router;
