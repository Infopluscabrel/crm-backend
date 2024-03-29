const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const validator = require('validator');



async function getMultiple(page = 1 , user , role) {

 let id =  user.user_id
  const offset = helper.getOffset(page, config.listPerPage);

let donnees 
 if (role==1) {
        donnees = await db.query(
          `SELECT *
          FROM produit 
          WHERE  PROPRIETAIRE="${id}"
          LIMIT ${offset},${config.listPerPage}
          
          `
  );
 } else if (role==2) {
   
            donnees = await db.query(
        `SELECT *
        FROM produit 
        WHERE  id_grossiste="${id}"
        LIMIT ${offset},${config.listPerPage}
        
        `
  );
 } else if(role==3) {
     donnees = await db.query(
    `SELECT *
    FROM produit 
    WHERE  id_detaillant="${id}"
    LIMIT ${offset},${config.listPerPage}
    
    `
  );
 }
 



  const data = helper.emptyOrRows(donnees);
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
     from produit 
    where produit.ID_PRODUIT="${id}"  `
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
    console.log("produit don t exist")
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
    console.log("produit don t exist")
  }
  //const meta = { page };
  

  return {
    data,

  };
}

async function login(email, password) {
  let produitToken;
  let produitRefresh;

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
      return "produit must login with Web SSO "
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

      produitToken = token;
    }

    );

    generateRefreshToken(data[0]).then(async (rtoken) => {

      const saveTOken = await db.query(
        `UPDATE utilisateur
              set refresh_token = "${rtoken}"
              where id= "${data[0].id}" `
      );
      produitRefresh = rtoken;
    });



  } else {
    return "product don't exist ";
  }



  return {
    data,
    produitToken,
    produitRefresh

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
    return "produit don't exist ";
  }



  return {
    data,

  };
}

async function generateAuthToken(produit) {


  tokensecret = process.env.secretToken || "12345"
  const token = jwt.sign({ id: produit.id }, tokensecret, { expiresIn: 60 * 60 })

  produit.token = token


  // update produit table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set token = "${token}"
where id= "${produit.id}" `
  );




  return token
}

async function generateRefreshToken(produit) {


  tokensecret = process.env.RefreshsecretToken || "12345"
  const rtoken = jwt.sign({ id: produit.id }, tokensecret, { expiresIn: 60 * 60 * 20 })

  produit.refresh_token = rtoken


  // update produit table 
  const saveTOken = await db.query(
    `UPDATE utilisateur
set refresh_token = "${rtoken}"
where id= "${produit.id}" `
  );




  return rtoken
}

async function create(produit) {



 let nom = produit.nom || "" ;
 let prix = produit.prix || ""  ;
 let quantite = produit.quantite || "" ;
 let proprietaire = produit.proprietaire || ""  ; 
 
 
  const result = await db.query(
    `INSERT INTO produit 
    (  NOM_PRODUIT , prix , QUANTITE ,  PROPRIETAIRE   )
    VALUES 
    ( "${nom}", "${prix}", "${quantite}" , "${proprietaire}" 
     )`
  );

  let message = "Error in creating produit";

  if (result.affectedRows) {
    message = "produit  created successfully";
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

    let message = "Error in creating produit";

    if (result.affectedRows) {
      message = "produit  created successfully";
    }

    return { message };

  } else {

    let message = "produit exist in database";
    return { message };
  }



}

async function update(id, produit) {

  const result = await db.query(
    `UPDATE produit
    SET NOM_PRODUIT="${produit.nom}", prix="${produit.prix}", QUANTITE="${produit.quantite}"
    
    WHERE ID_PRODUIT="${id}"`
  );

  let message = "Error in updating product language";

  if (result.affectedRows) {
    message = "produit updated successfully";
  }

  return { message };
}

async function entreeStock(id, produit) {

  const result = await db.query(
    `UPDATE produit
    SET  QUANTITE=produit.QUANTITE + "${produit.quantite}"
    
    WHERE ID_PRODUIT="${id}"`
  );

   const entree = await db.query(
    `INSERT INTO entreestock( id_produit, quantite , proprietaire ) VALUES ( "${produit.id}"  , "${produit.quantite}" , "${produit.proprietaire}" )`
  );
  let message = "Erreur lors de l'entree en stocks ";

  if (result.affectedRows) {
    message = "entree executed successfully";
  }

  return { message };
}

async function entreeStockList( produit, page = 1) {
const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id , entreestock.id_produit ,entreestock.quantite ,NOM_PRODUIT
    FROM entreestock , produit  
    
    where produit.ID_PRODUIT=entreestock.id_produit
    and  entreestock.proprietaire="${produit.proprietaire}"
    LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function updatepassword(id, produit) {

  let password = await bcrypt.hash(produit.motDePasse, 8);
  const result = await db.query(
    `UPDATE utilisateur
    SET password="${password}"
    WHERE id="${id}"`
  );

  let message = "Error in updating programming language";

  if (result.affectedRows) {
    message = "produit password updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM utilisateur  WHERE id=${id}`
  );

  let message = "Error in deleting  produit ";

  if (result.affectedRows) {
    message = "produit  deleted successfully";
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
    message = "produit profile image updated successfully";
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
