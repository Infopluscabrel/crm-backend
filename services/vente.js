const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const validator = require('validator');



async function getMultiple(page = 1 , user) {
  const offset = helper.getOffset(page, config.listPerPage);
  
  let data = [] ;
  // les user dont il est parrain 
   const parrain = await db.query(
    `SELECT ID_USER
    FROM user
    WHERE user.USE_ID_USER="${user.user_id}"
    LIMIT ${offset},${config.listPerPage}`
  );
 
  parrain.forEach( u => {
     const rows =  db.query(
    `SELECT produit.NOM_PRODUIT , ligne_commande.quantite
    FROM vente  , ligne_commande , produit
    WHERE vente.user_id="${u.user_id}"

    and ligne_commande.id_vente = vente.id 

    and ligne_commande.id_produit= produit.ID_PRODUIT

    GROUP BY vente.id
    LIMIT ${offset},${config.listPerPage}`
  );
   data.push(helper.emptyOrRows(rows));
  })

  
 
  const meta = { page };

  return {
    data,
    meta,
  };
}


async function getMesVentes(page = 1 , user) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM vente  , ligne_commande , produit
    WHERE vente.user_id="${user.user_id}"
    and ligne_commande.id_vente = vente.id 
    and ligne_commande.id_produit= produit.ID_PRODUIT
    GROUP BY vente.id
    LIMIT ${offset},${config.listPerPage}`
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
     from vente 
    where vente.id="${id}"  `
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
    return "produit don't exist ";
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



 let lignes = produit.lignes || "" ;
 let status = produit.status || ""  ;
 let payment_status = produit.payment_status || "" ;
  let user_id = produit.user_id || "" ;
 let total = produit.total || "" ;
 
  const result = await db.query(
    `
   INSERT INTO vente 
    (   status , payment_status ,  user_id , total   )
    VALUES 
    (  "0",  "0", "${user_id}" , "${total}" 
     );
   `
  );
 

  const id_vente = await db.query(
    `
   select MAX(id) as id_vente FROM vente;
    `
  );
 const data = helper.emptyOrRows(id_vente);

  let message = "Error in creating vente";

  if (result.affectedRows) {
    message = "vente  created successfully";
  }

  return { 
    data,
    message };
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
    `INSERT INTO entreestock( id_produit, quantite) VALUES ( "${produit.id}"  , "${produit.quantite}" )`
  );
  let message = "Erreur lors de l'entree en stocks ";

  if (result.affectedRows) {
    message = "entree executed successfully";
  }

  return { message };
}

async function sortieStock(id, produit) {

  const result = await db.query(
    `UPDATE produit
    SET  QUANTITE=produit.QUANTITE - "${produit.quantite}"
    
    WHERE ID_PRODUIT="${id}"`
  );

   const entree = await db.query(
    `INSERT INTO entreestock( id_produit, quantite) VALUES ( "${produit.id}"  , "${produit.quantite}" )`
  );
  let message = "Erreur lors de l'entree en stocks ";

  if (result.affectedRows) {
    message = "entree executed successfully";
  }

  return { message };
}

async function entreeStockList(id, produit, page = 1) {
const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id , entreestock.id_produit ,entreestock.quantite ,NOM_PRODUIT
    FROM entreestock , produit  
    
    where produit.ID_PRODUIT=entreestock.id_produit
    LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}
 

async function validateStock ( command) {
      const result = await db.query(
      `UPDATE vente
      SET  status=1 
      
      WHERE id="${command.id}"`
    );


    // liste des lignes de la commande 
        const rows = await db.query(
    `SELECT *
    from ligne_commande
    where ligne_commande.id_vente="${command.id}"
    `
  );

  let message ;
  const data = helper.emptyOrRows(rows);
 data.forEach(e => {
     
   
        const result =  db.query(
      `UPDATE produit , ligne_commande 
      SET  produit.QUANTITE = produit.QUANTITE - "${e.quantite}" , produit.qte_grossiste = produit.qte_grossiste + "${e.quantite}",
      produit.id_grossiste = "${command.user_id}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );

      message = "Erreur lors de l'entree en stocks ";

     // Incrementer les produit concerner et qtes dans le stocks du user 
      

          // appel de fonction de charge du user 

           //verifie si le produit extiste 
          /* const fouille =  db.query(
    `SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}
     
    "
    
    
    `
  );
  const r1 = helper.emptyOrRows(rows);

  if(r1==[]) {

   const donnees = helper.emptyOrRows(fouille)

    const creation =  db.query(
    `INSERT INTO produit 
    (  NOM_PRODUIT , prix , QUANTITE ,  PROPRIETAIRE   )
    VALUES 
    ( "${donnees.NOM_PRODUIT}", "${donnees.prix}", "${qte}" , "${command.user_id}" 
     )`

  );
  } else {
       const result =  db.query(
      `UPDATE produit  
      SET  produit.QUANTITE = produit.QUANTITE + "${e.quantite}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );
  }
           */

    if (result.affectedRows) {
       message = "Commande valide avec succes ";
    }

   
 })
 
    return { message };
  }

async function validateStockDetaillant ( command) {
      const result = await db.query(
      `UPDATE vente
      SET  status=1 
      
      WHERE id="${command.id}"`
    );


    // liste des lignes de la commande 
        const rows = await db.query(
    `SELECT *
    from ligne_commande
    where ligne_commande.id_vente="${command.user_id}"
    `
  );

  let message ;
  const data = helper.emptyOrRows(rows);
 data.forEach(e => {
     
   
        const result =  db.query(
      `UPDATE produit , ligne_commande 
      SET  produit.QUANTITE = produit.QUANTITE - "${e.quantite}" , produit.qte_detaillant = produit.qte_detaillant + "${e.quantite}" ,
      produit.id_detaillant = "${command.id}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );

      message = "Erreur lors de l'entree en stocks ";

     // Incrementer les produit concerner et qtes dans le stocks du user 
      

          // appel de fonction de charge du user 

           //verifie si le produit extiste 
          /* const fouille =  db.query(
    `SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}
     
    "
    
    
    `
  );
  const r1 = helper.emptyOrRows(rows);

  if(r1==[]) {

   const donnees = helper.emptyOrRows(fouille)

    const creation =  db.query(
    `INSERT INTO produit 
    (  NOM_PRODUIT , prix , QUANTITE ,  PROPRIETAIRE   )
    VALUES 
    ( "${donnees.NOM_PRODUIT}", "${donnees.prix}", "${qte}" , "${command.user_id}" 
     )`

  );
  } else {
       const result =  db.query(
      `UPDATE produit  
      SET  produit.QUANTITE = produit.QUANTITE + "${e.quantite}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );
  }
           */

    if (result.affectedRows) {
       message = "Commande valide avec succes ";
    }

   
 })
 
    return { message };
  }
/*  
async function validateStock ( command) {
      const result = await db.query(
      `UPDATE vente
      SET  status=1 
      
      WHERE id="${command.id}"`
    );


    // liste des lignes de la commande 

    
        const rows = await db.query(
    `SELECT *
    from ligne_commande
    where ligne_commande.id_vente="${command.id}"
    `
  );

  let message ;
  const data = helper.emptyOrRows(rows);
  console.log("liste des lignes ")
          console.log(data.length)
  console.log("fin des lignes ")
let e  = data[1] ;
//return e;
console.log( "data[0" + data[0]) ;
  // essaie for 
  /*
 for (let i = 0 ; i<=data.length ; i++ ) { 
     
     e=data[i] ;
 console.log(" valeur de 0") ;
    console.log(e) ;
        const resu =  db.query(
      `UPDATE produit , ligne_commande 

      SET  produit.QUANTITE = produit.QUANTITE - "${data[i].quantite}"
      WHERE produit.ID_PRODUIT = "${data[i].id_produit}"
       `
    );

     // message = "Erreur lors de l'entree en stocks ";

     // Incrementer les produit concerner et qtes dans le stocks du user 
      
           //verifie si le produit extiste 

           console.log(`SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}"
     `)   ;        
       const fouille =  db.query(
    `SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}"
     `
  );



  const donnees =  ( helper.emptyOrRows(fouille) ,  (data) => {
      console.log("voici les donnees  ")
    console.log(data) 
  })

  console.log("liste des produits select ")
          console.log(donnees())
  console.log("fin des produits ")

  
  if(donnees==[]) {

   consol

    const creation =  db.query(
    `INSERT INTO produit 
    (  NOM_PRODUIT , prix , QUANTITE ,  PROPRIETAIRE   )
    VALUES 
    ( "${donnees.NOM_PRODUIT}", "${donnees.prix}", "${e.quantite}" , "${command.user_id}" 
     )`

  );
  } else {
       const result =  db.query(
      `UPDATE produit  

      SET  produit.QUANTITE = produit.QUANTITE + "${e.quantite}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );
  }
             

    if (result.affectedRows) {
       message = "Commande valide avec succes ";
    }

   
 } */
 // end for 
 
 // essaie forEach 
 /*
data.forEach ( e=> {
      const resu =  db.query(
      `UPDATE produit , ligne_commande 

      SET  produit.QUANTITE = produit.QUANTITE - "${e.quantite}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );

     // message = "Erreur lors de l'entree en stocks ";

     // Incrementer les produit concerner et qtes dans le stocks du user 
      
           //verifie si le produit extiste 

           console.log(`SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}"
     `)   ;        
       const fouille =  db.query(
    `SELECT *
    FROM produit 
    WHERE  ID_PRODUIT="${e.id_produit}"
     `
  );



  const donnees =   helper.emptyOrRows(fouille) 

  console.log("liste des produits select ")
          console.log(donnees)
  console.log("fin des produits ")

  
  if(donnees==[]) {



    const creation =  db.query(
    `INSERT INTO produit 
    (  NOM_PRODUIT , prix , QUANTITE ,  PROPRIETAIRE   )
    VALUES 
    ( "${donnees.NOM_PRODUIT}", "${donnees.prix}", "${e.quantite}" , "${command.user_id}" 
     )`

  );
  } else {
       const result =  db.query(
      `UPDATE produit  

      SET  produit.QUANTITE = produit.QUANTITE + "${e.quantite}"
      WHERE produit.ID_PRODUIT = "${e.id_produit}"
       `
    );
  }
             

    if (result.affectedRows) {
       message = "Commande valide avec succes ";
    }

})


    return { message };
  }
*/


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
getMesVentes,
  entreeStock,
  sortieStock,
  entreeStockList ,
  validateStock ,
  validateStockDetaillant

};
