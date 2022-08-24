const express = require("express");
const router = express.Router();
const lignes = require("../services/commandline");
const passport = require('passport');
const multer = require('multer')
const auth = require('../middleware/auth') ;
const authRefresh = require('../middleware/authRefresh') ;

/* GET lignes . */
router.get("/all", async function (req, res, next) {
  try {
    
    res.json(await lignes.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting lignes s `, err.message);
    next(err);
  }
});

/* POST lignes language */
router.post("/new", async function (req, res, next) {
  try {
    res.json(await lignes.create(req.body));
  } catch (err) {
    console.error(`Error while creating lignes `, err.message);
    next(err);
  }
});

// social login with websso 
router.get('/google', (req, res) => {
  res.send('<a href="/lignes/auth/google">Authenticate with Google</a>');
}); 


/* POST lignes by Id Google */
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

// save article to database 
router.get("/new/google", async function (req, res, next) {
  try {
  
    let myarticle = await lignes.findOrcreateById(req.article.id , req.article.picture , 'GoogleId' ,req.article.family_name ,req.article.given_name , req.article.email );
    res.json(myarticle);
  } catch (err) {
    console.error(`Error while creating lignes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/lignes/new/google',
    failureRedirect: '/auth/google/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.article );
});

// when Authentification fail 
router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});




//get profile of a article 

router.get("/profile/:id", async function (req, res, next) {
  try {
    
    res.json(await lignes.getOne(req.query.page , req.params.id));
  } catch (err) {
    console.error(`Error while getting lignes  `, err.message);
    next(err);
  }
});

//get profile of a article 

router.get("/profile",auth ,  async function (req, res, next) {
  try {
    
  console.log(req.article)
    res.status(200).send(req.article)
  } catch (err) {
    console.error(`Error while getting lignes  `, err.message);
    next(err);
  }
});

// Login

router.post("/login", async function (req, res, next) {
  try {
    
    res.json(await lignes.login( req.body.email , req.body.motDePasse ));
  } catch (err) {
    console.error(`Error while getting lignes  `, err.message);
    next(err);
  }
});


//article logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

// refresh-token

router.post("/refreshtoken", authRefresh , async function (req, res, next) {
  try {
    
    res.json(await lignes.refreshToken( req.body.refresh_token  ));
  } catch (err) {
    console.error(`Error while getting lignes  `, err.message);
    next(err);
  }
});

/* PUT lignes language */
router.put("/update",   async function (req, res, next) {
  try {
    
    res.json(await lignes.update(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating article `, err.message);
    next(err);
  }
});

/* Entree de stocks  */
router.get("/stock/entree/all",   async function (req, res, next) {
  try {
    
    res.json(await lignes.entreeStockList() );
  } catch (err) {
    console.error(`Error on entries list `, err.message);
    next(err);
  }
});
/* PUT lignes language */
router.post("/stock/entree",   async function (req, res, next) {
  try {
    
    res.json(await lignes.entreeStock(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating article `, err.message);
    next(err);
  }
});

/* PUT lignes password */
router.put("/update/password", auth ,  async function (req, res, next) {
  try {
    
    res.json(await lignes.updatepassword(req.article.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating article `, err.message);
    next(err);
  }
});

/* DELETE lignes language */
router.delete("/delete", auth , async function (req, res, next) {
  try {
    res.json(await lignes.remove(req.article.id));
  } catch (err) {
    console.error(`Error while deleting article `, err.message);
    next(err);
  }
});


// authentification avec microsoft 
// social login with websso 
router.get('/microsoft', (req, res) => {
  res.send('<a href="/lignes/auth/microsoft">Authenticate with microsoft</a>');
}); 


/* POST lignes by Id Google */
router.get('/auth/microsoft',
  passport.authenticate('microsoft') 
);

// save article to database 
router.get("/new/microsoft", async function (req, res, next) {
  try {
    let myarticle = await lignes.findOrcreateById(req.article.id , "NULL" , 'MicrosoftId' ,req.article._json.surname ,req.article._json.givenName , req.article._json.mail );
    res.json(myarticle);
  } catch (err) {
    console.error(`Error while creating lignes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/microsoft/callback',
  passport.authenticate( 'microsoft', {
    successRedirect: '/lignes/new/microsoft',
    failureRedirect: '/auth/microsoft/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.article );
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
    
    res.json(await lignes.updateProfile(req.params.id  , req.file.filename ) );
  } catch (err) {
    console.error(`Error while updating article `, err.message);
    next(err);
  }


})




module.exports = router;
