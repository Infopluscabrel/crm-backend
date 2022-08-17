const passport = require('passport');
require('dotenv').config();


var MicrosoftStrategy = require('passport-microsoft').Strategy;


const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || 'IoM7Q~ulJymRVLaM6F0Xu1WyP85oCqdyxZSIy';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '3JT7Q~ltuhDzxjjccMLpc7AzYX4TWrFgJnkjy';

//const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '..t7Q~kDZj5irme2mN0BSqJandGQ0xYlylKSM';
//const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || 'deb83dcd-0c8f-4c6d-a9d4-8f78410f445e';

passport.use(new MicrosoftStrategy({

   clientID: MICROSOFT_CLIENT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
 
  callbackURL: "http://localhost:5000/users/microsoft/callback",
  scope: ['user.read']
},
function(request, accessToken, refreshToken, profile, done) {

  
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
