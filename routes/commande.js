const express = require("express");
const router = express.Router();
const commandes = require("../services/commande");
const passport = require('passport');
const multer = require('multer')
const auth = require('../middleware/auth') ;
const authRefresh = require('../middleware/authRefresh') ;


/* GET commandes . */
router.get("/all", async function (req, res, next) {
  try {
    
    res.json(await commandes.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting commandes  `, err.message);
    next(err);
  }
});

/* POST commandes language */
router.post("/new", async function (req, res, next) {
  try {
    res.json(await commandes.create(req.body));
  } catch (err) {
    console.error(`Error while creating commandes `, err.message);
    next(err);
  }
});

// social login with websso 
router.get('/google', (req, res) => {
  res.send('<a href="/commandes/auth/google">Authenticate with Google</a>');
}); 


/* POST commandes by Id Google */
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

// save commande to database 
router.get("/new/google", async function (req, res, next) {
  try {
  
    let mycommande = await commandes.findOrcreateById(req.commande.id , req.commande.picture , 'GoogleId' ,req.commande.family_name ,req.commande.given_name , req.commande.email );
    res.json(mycommande);
  } catch (err) {
    console.error(`Error while creating commandes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/commandes/new/google',
    failureRedirect: '/auth/google/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.commande );
});

// when Authentification fail 
router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});




//get profile of a commande 

router.get("/profile/:id", async function (req, res, next) {
  try {
    
    res.json(await commandes.getOne(req.query.page , req.params.id));
  } catch (err) {
    console.error(`Error while getting commandes  `, err.message);
    next(err);
  }
});

//get profile of a commande 

router.get("/profile",auth ,  async function (req, res, next) {
  try {
    
  console.log(req.commande)
    res.status(200).send(req.commande)
  } catch (err) {
    console.error(`Error while getting commandes  `, err.message);
    next(err);
  }
});

// Login

router.post("/login", async function (req, res, next) {
  try {
    
    res.json(await commandes.login( req.body.email , req.body.motDePasse ));
  } catch (err) {
    console.error(`Error while getting commandes  `, err.message);
    next(err);
  }
});


//commande logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

// refresh-token

router.post("/refreshtoken", authRefresh , async function (req, res, next) {
  try {
    
    res.json(await commandes.refreshToken( req.body.refresh_token  ));
  } catch (err) {
    console.error(`Error while getting commandes  `, err.message);
    next(err);
  }
});

/* PUT commandes language */
router.put("/update",   async function (req, res, next) {
  try {
    
    res.json(await commandes.update(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating commande `, err.message);
    next(err);
  }
});

/* Entree de stocks  */
router.get("/stock/entree/all",   async function (req, res, next) {
  try {
    
    res.json(await commandes.entreeStockList() );
  } catch (err) {
    console.error(`Error on entries list `, err.message);
    next(err);
  }
});
/* PUT commandes language */
router.post("/stock/entree",   async function (req, res, next) {
  try {
    
    res.json(await commandes.entreeStock(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating commande `, err.message);
    next(err);
  }
});

/* PUT commandes password */
router.put("/update/password", auth ,  async function (req, res, next) {
  try {
    
    res.json(await commandes.updatepassword(req.commande.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating commande `, err.message);
    next(err);
  }
});

/* DELETE commandes language */
router.delete("/delete", auth , async function (req, res, next) {
  try {
    res.json(await commandes.remove(req.commande.id));
  } catch (err) {
    console.error(`Error while deleting commande `, err.message);
    next(err);
  }
});


// authentification avec microsoft 
// social login with websso 
router.get('/microsoft', (req, res) => {
  res.send('<a href="/commandes/auth/microsoft">Authenticate with microsoft</a>');
}); 


/* POST commandes by Id Google */
router.get('/auth/microsoft',
  passport.authenticate('microsoft') 
);

// save commande to database 
router.get("/new/microsoft", async function (req, res, next) {
  try {
    let mycommande = await commandes.findOrcreateById(req.commande.id , "NULL" , 'MicrosoftId' ,req.commande._json.surname ,req.commande._json.givenName , req.commande._json.mail );
    res.json(mycommande);
  } catch (err) {
    console.error(`Error while creating commandes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/microsoft/callback',
  passport.authenticate( 'microsoft', {
    successRedirect: '/commandes/new/microsoft',
    failureRedirect: '/auth/microsoft/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.commande );
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
    
    res.json(await commandes.updateProfile(req.params.id  , req.file.filename ) );
  } catch (err) {
    console.error(`Error while updating commande `, err.message);
    next(err);
  }


})




module.exports = router;
