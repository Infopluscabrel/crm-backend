const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const validator = require('validator');



async function getMultiple(page = 1) {
  console.log("GETTING ALL LINES ")
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM ligne_commande  LIMIT ${offset},${config.listPerPage}`
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
     from ligne_commande 
    where ligne_commande.id="${id}"  `
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
    console.log("ligne don t exist")
  }
  //const meta = { page };


  return {
    data,

  };
}


async function getOneIdRefreshToken(id, token) {
  let page = 1;
  let quer = `SELECT  
    utilisateur.id,  nom, prenom, telephone, email, IdOauth, modeLogin, 
   image, utilisateur.createdAt, utilisateur.updatedAt , role.libelle 
    FROM utilisateur , role
    where utilisateur.id="${id}" and refresh_token="${token}" `
  console.log("token ref" + token)

  const rows = await db.query(
    quer
  );


  const data = helper.emptyOrRows(rows);

  if (data.length != 0) {
    console.log("service data " + data);
  } else {
    console.log("ligne don t exist")
  }
  //const meta = { page };
  

  return {
    data,

  };
}

async function login(email, password) {
  let ligneToken;
  let ligneRefresh;

  await validateEmail(email);


  const rows = await db.query(
    `SELECT * 
    FROM utilisateur 
    where email="${email}"  `
  );
  const data = helper.emptyOrRows(rows);




  //const meta = { page };
  if (data.length != 0) {

    if(data[0].password == null ){
      return "ligne must login with Web SSO "
    }

  const isMatch = await bcrypt.compare(password, data[0].password)

   

    if (!isMatch) {
      throw new Error('Unable to login')
    }


    generateAuthToken(data[0]).then(async (token) => {

      const saveTOken = await db.query(
        `UPDATE utilisateur
set token = "${token}"
where id= "${data[0].id}" `
      );

      ligneToken = token;
    }

    );

    generateRefreshToken(data[0]).then(async (rtoken) => {

      const saveTOken = await db.query(
        `UPDATE utilisateur
              set refresh_token = "${rtoken}"
              where id= "${data[0].id}" `
      );
      ligneRefresh = rtoken;
    });



  } else {
    return "ligne don't exist ";
  }



  return {
    data,
    ligneToken,
    ligneRefresh

  };
}

async function refreshToken(refresh) {

  const rows = await db.query(
    `SELECT * 
    FROM utilisateur 
    where refresh_token="${refresh}"  `
  );
  const data = helper.emptyOrRows(rows);
  console.log(refresh);




  //const meta = { page };
  if (data.length != 0) {





    generateAuthToken(data[0]).then(async (token) => {

      const saveTOken = await db.query(
        `UPDATE utilisateur
set token = "${token}"
where id= "${data[0].id}" `
      );

      return { token };

    }

    );



  } else {
    return "ligne don't exist ";
  }



  return {
    data,

  };
}

async function generateAuthToken(ligne) {


  tokensecret = process.env.secretToken || "12345"
  const token = jwt.sign({ id: ligne.id }, tokensecret, { expiresIn: 60 * 60 })

  ligne.token = token


  // update ligne table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set token = "${token}"
where id= "${ligne.id}" `
  );




  return token
}

async function generateRefreshToken(ligne) {


  tokensecret = process.env.RefreshsecretToken || "12345"
  const rtoken = jwt.sign({ id: ligne.id }, tokensecret, { expiresIn: 60 * 60 * 20 })

  ligne.refresh_token = rtoken


  // update ligne table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set refresh_token = "${rtoken}"
where id= "${ligne.id}" `
  );




  return rtoken
}

async function create(ligne) {



 let id_produit = ligne.id_produit || "" ;
 
 let quantite = ligne.quantite || "" ;
 let id_vente = ligne.id_vente || "" ;
 
 
  const result = await db.query(
    `INSERT INTO ligne_commande 
    (  id_produit , quantite  ,id_vente  )
    VALUES 
    ( "${id_produit}", "${quantite}" , "${id_vente}" 
     )`
  );

  let message = "Error in creating ligne";

  if (result.affectedRows) {
    message = "ligne  created successfully";
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

    let message = "Error in creating ligne";

    if (result.affectedRows) {
      message = "ligne  created successfully";
    }

    return { message };

  } else {

    let message = "ligne exist in database";
    return { message };
  }



}

async function update(id, ligne) {

  const result = await db.query(
    `UPDATE ligne
    SET NOM_ligne="${ligne.nom}", prix="${ligne.prix}", QUANTITE="${ligne.quantite}"
    
    WHERE ID_ligne="${id}"`
  );

  let message = "Error in updating product language";

  if (result.affectedRows) {
    message = "ligne updated successfully";
  }

  return { message };
}

async function entreeStock(id, ligne) {

  const result = await db.query(
    `UPDATE ligne
    SET  QUANTITE=ligne.QUANTITE + "${ligne.quantite}"
    
    WHERE ID_ligne="${id}"`
  );

   const entree = await db.query(
    `INSERT INTO entreestock( id_ligne, quantite) VALUES ( "${ligne.id}"  , "${ligne.quantite}" )`
  );
  let message = "Erreur lors de l'entree en stocks ";

  if (result.affectedRows) {
    message = "entree executed successfully";
  }

  return { message };
}

async function entreeStockList(id, ligne, page = 1) {
const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id , entreestock.id_ligne ,entreestock.quantite ,NOM_ligne
    FROM entreestock , ligne  
    
    where ligne.ID_ligne=entreestock.id_ligne
    LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function updatepassword(id, ligne) {

  let password = await bcrypt.hash(ligne.motDePasse, 8);
  const result = await db.query(
    `UPDATE utilisateur
    SET password="${password}"
    WHERE id="${id}"`
  );

  let message = "Error in updating programming language";

  if (result.affectedRows) {
    message = "ligne password updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM utilisateur  WHERE id=${id}`
  );

  let message = "Error in deleting  ligne ";

  if (result.affectedRows) {
    message = "ligne  deleted successfully";
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
    message = "ligne profile image updated successfully";
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
  entreeStock,
  entreeStockList

};
