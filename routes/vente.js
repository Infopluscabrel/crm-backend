const express = require("express");
const router = express.Router();
const ventes = require("../services/vente");
const passport = require('passport');
const multer = require('multer')
const auth = require('../middleware/auth') ;
const authRefresh = require('../middleware/authRefresh') ;

/* GET ventes . */
router.get("/all", async function (req, res, next) {
  try {
    
    res.json(await ventes.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting ventes  `, err.message);
    next(err);
  }
});

/* POST ventes language */
router.post("/new", async function (req, res, next) {
  try {
    res.json(await ventes.create(req.body));
  } catch (err) {
    console.error(`Error while creating ventes `, err.message);
    next(err);
  }
});

// social login with websso 
router.get('/google', (req, res) => {
  res.send('<a href="/ventes/auth/google">Authenticate with Google</a>');
}); 


/* POST ventes by Id Google */
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

// save vente to database 
router.get("/new/google", async function (req, res, next) {
  try {
  
    let myvente = await ventes.findOrcreateById(req.vente.id , req.vente.picture , 'GoogleId' ,req.vente.family_name ,req.vente.given_name , req.vente.email );
    res.json(myvente);
  } catch (err) {
    console.error(`Error while creating ventes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/ventes/new/google',
    failureRedirect: '/auth/google/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.vente );
});

// when Authentification fail 
router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});




//get profile of a vente 

router.get("/profile/:id", async function (req, res, next) {
  try {
    
    res.json(await ventes.getOne(req.query.page , req.params.id));
  } catch (err) {
    console.error(`Error while getting ventes  `, err.message);
    next(err);
  }
});

//get profile of a vente 

router.get("/profile",auth ,  async function (req, res, next) {
  try {
    
  console.log(req.vente)
    res.status(200).send(req.vente)
  } catch (err) {
    console.error(`Error while getting ventes  `, err.message);
    next(err);
  }
});

// Login

router.post("/login", async function (req, res, next) {
  try {
    
    res.json(await ventes.login( req.body.email , req.body.motDePasse ));
  } catch (err) {
    console.error(`Error while getting ventes  `, err.message);
    next(err);
  }
});


//vente logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

// refresh-token

router.post("/refreshtoken", authRefresh , async function (req, res, next) {
  try {
    
    res.json(await ventes.refreshToken( req.body.refresh_token  ));
  } catch (err) {
    console.error(`Error while getting ventes  `, err.message);
    next(err);
  }
});

/* PUT ventes language */
router.put("/update",   async function (req, res, next) {
  try {
    
    res.json(await ventes.update(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating vente `, err.message);
    next(err);
  }
});

/* Entree de stocks  */
router.get("/stock/entree/all",   async function (req, res, next) {
  try {
    
    res.json(await ventes.entreeStockList() );
  } catch (err) {
    console.error(`Error on entries list `, err.message);
    next(err);
  }
});
/* PUT ventes language */
router.post("/stock/entree",   async function (req, res, next) {
  try {
    
    res.json(await ventes.entreeStock(req.body.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating vente `, err.message);
    next(err);
  }
});

/* PUT ventes password */
router.put("/update/password", auth ,  async function (req, res, next) {
  try {
    
    res.json(await ventes.updatepassword(req.vente.id  , req.body) );
  } catch (err) {
    console.error(`Error while updating vente `, err.message);
    next(err);
  }
});

/* DELETE ventes language */
router.delete("/delete", auth , async function (req, res, next) {
  try {
    res.json(await ventes.remove(req.vente.id));
  } catch (err) {
    console.error(`Error while deleting vente `, err.message);
    next(err);
  }
});


// authentification avec microsoft 
// social login with websso 
router.get('/microsoft', (req, res) => {
  res.send('<a href="/ventes/auth/microsoft">Authenticate with microsoft</a>');
}); 


/* POST ventes by Id Google */
router.get('/auth/microsoft',
  passport.authenticate('microsoft') 
);

// save vente to database 
router.get("/new/microsoft", async function (req, res, next) {
  try {
    let myvente = await ventes.findOrcreateById(req.vente.id , "NULL" , 'MicrosoftId' ,req.vente._json.surname ,req.vente._json.givenName , req.vente._json.mail );
    res.json(myvente);
  } catch (err) {
    console.error(`Error while creating ventes language`, err.message);
    next(err);
  }
});

// callback for passport authentification with google strategy
router.get( '/microsoft/callback',
  passport.authenticate( 'microsoft', {
    successRedirect: '/ventes/new/microsoft',
    failureRedirect: '/auth/microsoft/failure'
  })
);


// Authentificated correctly with google 

router.get('/protected', (req, res) => {
  
   res.json({
      success: true , 
      modeLogin:"google"
    } , 
    req.vente );
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
    
    res.json(await ventes.updateProfile(req.params.id  , req.file.filename ) );
  } catch (err) {
    console.error(`Error while updating vente `, err.message);
    next(err);
  }


})




module.exports = router;
