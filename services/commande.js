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
    FROM commande  LIMIT ${offset},${config.listPerPage}`
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
     from commande 
    where commande.ID_COMMANDE="${id}"  `
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
    console.log("commande don t exist")
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
    console.log("commande don t exist")
  }
  //const meta = { page };
  

  return {
    data,

  };
}

async function login(email, password) {
  let commandeToken;
  let commandeRefresh;

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
      return "commande must login with Web SSO "
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

      commandeToken = token;
    }

    );

    generateRefreshToken(data[0]).then(async (rtoken) => {

      const saveTOken = await db.query(
        `UPDATE utilisateur
              set refresh_token = "${rtoken}"
              where id= "${data[0].id}" `
      );
      commandeRefresh = rtoken;
    });



  } else {
    return "commande don't exist ";
  }



  return {
    data,
    commandeToken,
    commandeRefresh

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
    return "commande don't exist ";
  }



  return {
    data,

  };
}

async function generateAuthToken(commande) {


  tokensecret = process.env.secretToken || "12345"
  const token = jwt.sign({ id: commande.id }, tokensecret, { expiresIn: 60 * 60 })

  commande.token = token


  // update commande table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set token = "${token}"
where id= "${commande.id}" `
  );




  return token
}

async function generateRefreshToken(commande) {


  tokensecret = process.env.RefreshsecretToken || "12345"
  const rtoken = jwt.sign({ id: commande.id }, tokensecret, { expiresIn: 60 * 60 * 20 })

  commande.refresh_token = rtoken


  // update commande table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set refresh_token = "${rtoken}"
where id= "${commande.id}" `
  );

  return rtoken
}

async function create(commande) {



 let lignes = commande.lignes || "" ;
 let status = commande.status || ""  ;
 let payment_status = commande.payment_status || "" ;
  let user_id = commande.user_id || "" ;
 let total = commande.total || "" ;
 
  const result = await db.query(
    `INSERT INTO commande() VALUES ()`
  );

  let message = "Error in creating commande";

  if (result.affectedRows) {
    message = "commande  created successfully";
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

    let message = "Error in creating commande";

    if (result.affectedRows) {
      message = "commande  created successfully";
    }

    return { message };

  } else {

    let message = "commande exist in database";
    return { message };
  }



}

async function update(id, commande) {

  const result = await db.query(
    `UPDATE commande
    SET NOM_commande="${commande.nom}", prix="${commande.prix}", QUANTITE="${commande.quantite}"
    
    WHERE ID_commande="${id}"`
  );

  let message = "Error in updating product language";

  if (result.affectedRows) {
    message = "commande updated successfully";
  }

  return { message };
}

async function entreeStock(id, commande) {

  const result = await db.query(
    `UPDATE commande
    SET  QUANTITE=commande.QUANTITE + "${commande.quantite}"
    
    WHERE ID_commande="${id}"`
  );

   const entree = await db.query(
    `INSERT INTO entreestock( id_commande, quantite) VALUES ( "${commande.id}"  , "${commande.quantite}" )`
  );
  let message = "Erreur lors de l'entree en stocks ";

  if (result.affectedRows) {
    message = "entree executed successfully";
  }

  return { message };
}

async function entreeStockList(id, commande, page = 1) {
const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id , entreestock.id_commande ,entreestock.quantite ,NOM_commande
    FROM entreestock , commande  
    
    where commande.ID_commande=entreestock.id_commande
    LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function updatepassword(id, commande) {

  let password = await bcrypt.hash(commande.motDePasse, 8);
  const result = await db.query(
    `UPDATE utilisateur
    SET password="${password}"
    WHERE id="${id}"`
  );

  let message = "Error in updating programming language";

  if (result.affectedRows) {
    message = "commande password updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM utilisateur  WHERE id=${id}`
  );

  let message = "Error in deleting  commande ";

  if (result.affectedRows) {
    message = "commande  deleted successfully";
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
    message = "commande profile image updated successfully";
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
