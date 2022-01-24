const User = require("../models/user");
const passport = require("passport");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ message: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ message: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ message: 'Password must be at least 6 characters' });
    }

    console.log(errors)

    if(errors.length > 0 ) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
     console.log(email)
      const userExist = await User.findOne({ email });

      console.log(userExist, 1111)

      if(userExist) {
        errors.push({ message: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const user = await User.create({
          name,
          email,
          password,
          password2
        });

        user.save({ validateBeforeSave: false });

        req.flash(
          'success_msg',
          'You are now registered and can log in'
        );

        res.redirect('/users/login');

        // const token = user.getSecret();
        // res.status(201).json({
        //   token,
        // }).redirect('/users/login');

      }
    }

    // Create use
  } catch (error) {
    return res.status(500).json({
      message: error.message, text: 'akkakaka'
    });
  }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      //   return next(new ErrorResponse('Invalid credentials', 401));
      return res.status(401).json({
        message: "Invalid credential",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      //   return next(new ErrorResponse('Invalid credentials', 401));
      return res.status(401).json({
        message: "Invalid credential",
      });
    }


    const token = user.getSecret();

    res.status(201).json({
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.welcome = async (req, res, next) => {
  res.render('welcome')
}
exports.registerForm = async (req, res, next) => {
  res.render('register')
}
exports.loginForm = async (req, res, next ) => {
  res.render('login')
}
exports.dashboard  = async (req, res, next) => {
  res.render('dashboard', {
    user: req.user
  })
}

exports.passportAuth = async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}

// Logout
exports.logout =  async (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
}
