const express = require("express");
const router = express.Router();
const users = require("../services/user");
const passport = require('passport');
const multer = require('multer')
const auth = require('../middleware/auth') ;
const authRefresh = require('../middleware/authRefresh') ;

/* GET users . */
router.get("/all", async function (req, res, next) {
  try {
    
    res.json(await users.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting users s `, err.message);
    next(err);
  }
});

/* POST users language */
router.post("/new", async function (req, res, next) {
  try {
    res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while creating users `, err.message);
    next(err);
  }
});

// social login with websso 
router.get('/google', (req, res) => {
  res.send('<a href="/users/auth/google">Authenticate with Google</a>');
}); 


/* POST users by Id Google */
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

// save user to database 
router.get("/new/google", async function (req, res, next) {
  try {
  
    let myUser = await users.findOrcreateById(req.user.id , req.user.picture , 'GoogleId' ,req.user.family_name ,req.user.given_name , req.user.email );
    res.json(myUser);
  } catch (err) {
    console.error(`Error while creating users language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/users/new/google',
    failureRedirect: '/auth/google/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.user );
});

// when Authentification fail 
router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});




//get profile of a user 

router.get("/profile/:id", async function (req, res, next) {
  try {
    
    res.json(await users.getOne(req.query.page , req.params.id));
  } catch (err) {
    console.error(`Error while getting users  `, err.message);
    next(err);
  }
});

//get profile of a user 

router.get("/profile",auth ,  async function (req, res, next) {
  try {
    
  console.log(req.user)
    res.status(200).send(req.user)
  } catch (err) {
    console.error(`Error while getting users  `, err.message);
    next(err);
  }
});

// Login

router.post("/login", async function (req, res, next) {
  try {
    
    res.json(await users.login( req.body.email , req.body.motDePasse ));
  } catch (err) {
    console.error(`Error while getting users  `, err.message);
    next(err);
  }
});


//user logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

// refresh-token

router.post("/refreshtoken", authRefresh , async function (req, res, next) {
  try {
    
    res.json(await users.refreshToken( req.body.refresh_token  ));
  } catch (err) {
    console.error(`Error while getting users  `, err.message);
    next(err);
  }
});

/* PUT users language */
router.put("/update",   async function (req, res, next) {
  try {
    
    res.json(await users.update(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating user `, err.message);
    next(err);
  }
});

/* PUT users password */
router.put("/update/password", auth ,  async function (req, res, next) {
  try {
    
    res.json(await users.updatepassword(req.user.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating user `, err.message);
    next(err);
  }
});

/* DELETE users language */
router.delete("/delete", auth , async function (req, res, next) {
  try {
    res.json(await users.remove(req.user.id));
  } catch (err) {
    console.error(`Error while deleting user `, err.message);
    next(err);
  }
});


// authentification avec microsoft 
// social login with websso 
router.get('/microsoft', (req, res) => {
  res.send('<a href="/users/auth/microsoft">Authenticate with microsoft</a>');
}); 


/* POST users by Id Google */
router.get('/auth/microsoft',
  passport.authenticate('microsoft') 
);

// save user to database 
router.get("/new/microsoft", async function (req, res, next) {
  try {
    let myUser = await users.findOrcreateById(req.user.id , "NULL" , 'MicrosoftId' ,req.user._json.surname ,req.user._json.givenName , req.user._json.mail );
    res.json(myUser);
  } catch (err) {
    console.error(`Error while creating users language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/microsoft/callback',
  passport.authenticate( 'microsoft', {
    successRedirect: '/users/new/microsoft',
    failureRedirect: '/auth/microsoft/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.user );
});

// when Authentification fail 
router.get('/auth/microsoft/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

// upload image profile 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null,  `profile-${Date.now()}.${file.originalname}`)
    }
})
let upload = multer({ storage: storage , 
                     })

router.post('/profile-upload/:id', upload.single('profile-file'), async function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
 
   try {
    
    res.json(await users.updateProfile(req.params.id  , req.file.filename ) );
  } catch (err) {
    console.error(`Error while updating user `, err.message);
    next(err);
  }


})




module.exports = router;
