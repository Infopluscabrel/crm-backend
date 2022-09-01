const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const validator = require('validator');



async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM user  LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getOne(page = 1, id) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT  *
     from user ,roles
    where user.ID_USER="${id}" and roles.ID_ROLE=user.ID_ROLE `
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,

  };
}

async function getOneLogin(page = 1, id) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT  *
     from user ,roles
    where user.LOGIN="${id}" and roles.ID_ROLE=user.ID_ROLE `
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,

  };
}

async function getOneIdToken(id, token) {
  let page = 1;
  let quer = `SELECT  
    utilisateur.id,  nom, prenom, telephone, email, IdOauth, modeLogin, 
   image, utilisateur.createdAt, utilisateur.updatedAt , role.libelle 
    FROM utilisateur , role
    where utilisateur.id="${id}" and token="${token}" `


  const rows = await db.query(
    quer
  );


  const data = helper.emptyOrRows(rows);

  if (data.length != 0) {
    console.log("service data " + data);
  } else {
    console.log("user don t exist")
  }
  //const meta = { page };


  return {
    data,

  };
}


async function getOneIdRefreshToken(id, token) {
  let page = 1;
  let quer = `SELECT  
    user.id,  nom, prenom, telephone, email, IdOauth, modeLogin, 
   image, utilisateur.createdAt, utilisateur.updatedAt , role.libelle 
    FROM utilisateur , role
    where user.id="${id}" and refresh_token="${token}" `
  console.log("token ref" + token)

  const rows = await db.query(
    quer
  );


  const data = helper.emptyOrRows(rows);

  if (data.length != 0) {
    console.log("service data " + data);
  } else {
    console.log("user don t exist")
  }
  //const meta = { page };
  

  return {
    data,

  };
}

async function login(login, password , niveau) {

  let status ;
  let UserToken;
  //let userRefresh;


  const rows = await db.query(
    `SELECT * 
    FROM user 
    where LOGIN="${login}" and ID_ROLE="${niveau}"  `
  );
  const data = helper.emptyOrRows(rows);

  status = 200 ;


  //const meta = { page };
  if (data.length != 0) {

    if(data[0].PASSWORD == null ){
      return "User must login with Web SSO "
    }

  const isMatch = await bcrypt.compare(password, data[0].PASSWORD)

   

    if (!isMatch) {
      throw new Error('Unable to login')
      status= 404 
    }


    generateAuthToken(data[0]).then(async (token) => {

      const saveTOken = await db.query(
        `UPDATE user
set token = "${token}"
where ID_USER= "${data[0].id}" `
      );

      UserToken = token;
    }

    );

   /* generateRefreshToken(data[0]).then(async (rtoken) => {

      const saveTOken = await db.query(
        `UPDATE user
              set refresh_token = "${rtoken}"
              where ID_USER= "${data[0].id}" `
      );
      userRefresh = rtoken;
    });*/



  } else {
    return "User don't exist ";
    status = 404 ;
  }



  return {
    status ,
    data,
    UserToken,
    

  };
}

async function refreshToken(refresh) {

  const rows = await db.query(
    `SELECT * 
    FROM user 
    where refresh_token="${refresh}"  `
  );
  const data = helper.emptyOrRows(rows);
  console.log(refresh);




  //const meta = { page };
  if (data.length != 0) {





    generateAuthToken(data[0]).then(async (token) => {

      const saveTOken = await db.query(
        `UPDATE user
set token = "${token}"
where ID_USER= "${data[0].id}" `
      );

      return { token };

    }

    );



  } else {
    return "User don't exist ";
  }



  return {
    data,

  };
}

async function generateAuthToken(user) {


  tokensecret = process.env.secretToken || "12345"
  const token = jwt.sign({ id: user.id }, tokensecret, { expiresIn: 60 * 60 })

  user.token = token


  // update user table 
  const saveTOken = await db.query(
    `UPDATE user
set token = "${token}"
where ID_USER= "${user.id}" `
  );




  return token
}

async function generateRefreshToken(user) {


  tokensecret = process.env.RefreshsecretToken || "12345"
  const rtoken = jwt.sign({ id: user.id }, tokensecret, { expiresIn: 60 * 60 * 20 })

  user.refresh_token = rtoken


  // update user table 
  const saveTOken = await db.query(
    `UPDATE user
set refresh_token = "${rtoken}"
where ID_USER= "${user.id}" `
  );




  return rtoken
}

async function create(user) {

  let role = user.idRole || 2;

  let password = await bcrypt.hash(user.password, 8);
  await validateEmail(user.email);


 let parrain = user.parrain || "" ;
 let nom = user.nom || ""  ;
 let email = user.email || "" ;
  let login = user.login || "" ;
 let telephone = user.telephone || ""  ; 
 let est_limite = user.est_limite  || "" ;
 let montant_limite = user.montant_limite || "" ;

 let offre = user.offre  || "" ;
 let details_offre = user.details_offre  || "" ;
 let engagement = user.engagement  || "" ;
 let etat_signature = user.etat_signature  || "" ;
 let date_signature = user.date_signature  || "" ;
  let cni = user.cni  || "" ;

   let patente = user.patente  || "" ;
    let nui = user.etat_signature  || "" ;
    let etat_validation = user.etat_validation  || "" ;

     let date_validation = user.date_validation  || "" ;
     let etat_stock = user.etat_stock  || "" ;

      let date_expedition = user.date_expedition  || "" ;
 let adresse = user.adresse  || "" ;
         let precompte = user.precompte  || "" ;
          let ristourne = user.ristourne  || "" ;

          let que =  `INSERT INTO user 
    (  USE_ID_USER , ID_ROLE, LOGIN, NOM_USER, EMAIL, TELEPHONE , PASSWORD , EST_LIMITE, MONTANT_LIMITE ,offre , details_offre 
      , engagement , etat_signature , date_signature , cni ,patente , nui , etat_validation , date_validation , etat_stock , date_expedition , adresse,
      precompte , ristourne
      )
    VALUES 
    ( "${parrain}", "${role}", "${login}", "${nom}" , "${email}" , "${telephone}", "${password}" ,
     "${est_limite}"   ,  "${montant_limite}" , "${offre}" , "${details_offre}" , "${engagement}" , "${etat_signature}" , "${date_signature}" 
     , "${cni}" , "${patente}" , "${nui}" , "${etat_validation}" , "${date_validation}" , "${etat_stock}"  , "${date_expedition}"
     , "${adresse}" , "${precompte}"  , "${ristourne}" 
     )` ;
 
     console.log("query .  "  + que) ; 
  const result = await db.query(
    `INSERT INTO user 
    (  USE_ID_USER , ID_ROLE, LOGIN, NOM_USER, EMAIL, TELEPHONE , PASSWORD , EST_LIMITE, MONTANT_LIMITE ,offre , details_offre 
      , engagement , etat_signature , date_signature , cni ,patente , nui , etat_validation , date_validation , etat_stock , date_expedition , adresse,
      precompte , ristourne
      )
    VALUES 
    ( "${parrain}", "${role}", "${login}", "${nom}" , "${email}" , "${telephone}", "${password}" ,
     "${est_limite}"   ,  "${montant_limite}" , "${offre}" , "${details_offre}" , "${engagement}" , "${etat_signature}" , "${date_signature}" 
     , "${cni}" , "${patente}" , "${nui}" , "${etat_validation}" , "${date_validation}" , "${etat_stock}"  , "${date_expedition}"
     , "${adresse}" , "${precompte}"  , "${ristourne}" 
     )`
  );

  let message = "Error in creating user";

  if (result.affectedRows) {
    message = "user  created successfully";
  }

  return { message };
}

async function findOrcreateById(id, picture = "", mode, nom = "", prenom = "", email = "") {

  const rows = await db.query(
    `SELECT * 
    FROM utilisateur 
    where IdOauth="${id}"  `
  );
  const data = helper.emptyOrRows(rows);
  //const meta = { page };\


  if (data.length == 0) {
    const result = await db.query(
      `INSERT INTO utilisateur 
    ( IdOauth , image , modeLogin , idRole , nom ,prenom , email )   
    VALUES 
    ("${id}" , "${picture}" , "${mode}" , 2 , "${nom}" , "${prenom}", "${email}"   )`
    );

    let message = "Error in creating user";

    if (result.affectedRows) {
      message = "user  created successfully";
    }

    return { message };

  } else {

    let message = "user exist in database";
    return { message };
  }



}

async function update(id, user) {

  const result = await db.query(
    `UPDATE user
    SET NOM_USER="${user.nom}", LOGIN="${user.login}", email="${user.email}" , 
    EST_LIMITE = "${user.est_limite}"  , TELEPHONE = "${user.telephone}"  ,details_offre = "${user.details_offre}"  ,
    engagement = "${user.engagement}"  ,
    etat_signature = "${user.etat_signature}"  ,
    cni = "${user.cni}"  , patente = "${user.patente}"  ,
    nui = "${user.nui}"  , etat_validation = "${user.etat_validation}"  , 
    etat_stock = "${user.etat_stock}"  , adresse = "${user.adresse}"  ,
    precompte = "${user.precompte}"    

    WHERE ID_USER="${id}"`
  );

  let message = "Error in updating programming language";

  if (result.affectedRows) {
    message = "user updated successfully";
  }

  return { message };
}

async function updatepassword(id, user) {

  let password = await bcrypt.hash(user.password, 8);
  const result = await db.query(
    `UPDATE user
    SET PASSWORD="${password}"
    WHERE ID_USER="${id}"`
  );

  let message = "Error in updating programming language";

  if (result.affectedRows) {
    message = "user password updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM utilisateur  WHERE id=${id}`
  );

  let message = "Error in deleting  user ";

  if (result.affectedRows) {
    message = "user  deleted successfully";
  }

  return { message };
}

// update umage profile 
async function updateProfile(id, name) {
let url = process.env.url || "http://localhost:5000"  ;
let link = url+ "/uploads/"+name; 
  const result = await db.query(
    `UPDATE utilisateur
    SET image="${link}"
    WHERE id="${id}"`
  );

  let message = "Error in updating image profile ";

  if (result.affectedRows) {
    message = "user profile image updated successfully";
  }

  return { message , link };
}
// validation d'email
function validateEmail(value) {
  if (!validator.isEmail(value)) {
    throw new Error('Email is invalid')
  }
}
module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getOne,
  login,
  findOrcreateById,
  generateAuthToken,
  getOneIdToken,
  refreshToken,
  getOneIdRefreshToken,
  updatepassword,
  updateProfile,
  getOneLogin

};
