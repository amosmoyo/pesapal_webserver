const dotenv = require('dotenv');
dotenv.config({path: './configs/config.env'});

const flash = require('express-flash');

const https = require('https');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');

const database = require('./configs/db');

database()

var privateKey = fs.readFileSync("cert/key.pem", "utf8");

var certificate = fs.readFileSync("cert/cert.pem", "utf8");

const options = {key: privateKey, cert: certificate};

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
// app.use(flash())

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// app.use((req, res, next) => {
//     if (req.secure) {
//       next();
//     } else {
//       res.redirect("http://" + req.headers.host + req.url);
//     }
// });

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  // require('./configs/passport')(passport);
  
  // Connect flash
  app.use(flash());



// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.use('/users', require('./routes/auth'))

app.use(express.static(path.join(__dirname, '/public')))

const server = https.createServer(options, app);

server.listen(5000, () => {
    console.log('The app is runnig on port 5000!')
})

