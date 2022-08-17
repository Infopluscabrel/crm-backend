const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();



const auth = require('./middleware/auth') ;



require('./auth');
require('./auth-microsoft') ;
require('./auth-apple') ;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const user = require("./routes/user") ; 
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const secretkey = process.env.secret || 'default' ; 

app.use(session({ secret: secretkey, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

/* Error handler middleware */
app.use("/user", user );
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack)
  res.status(statusCode).json({ message: err.message });

  return;
});




app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/users/new/google',
    failureRedirect: '/users/auth/google/failure'
  })
); 
const port = process.env.PORT || 5000 ;
app.listen(port, () => console.log('app listening on port: 5000'));
