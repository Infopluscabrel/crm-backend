import "reflect-metadata"
import { AppDataSource } from "./data-source"
import routes from "./routes/index.route";
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// establish database connection
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

dotenv.config();

// create and setup express app
const helmet = require("helmet");

const app = express()
app.use(cors());
app.use(helmet());
app.use(express.json())

// Swagger configuration
const swaggerUi = require('swagger-ui-express');
const swaggerDocCatProd = require('./swagger/catprod.json');
const swaggerDocES = require('./swagger/entree-stock.json');
const swaggerDocFact = require('./swagger/facture.json');
const swaggerDocLComs = require('./swagger/commandline.json');
const swaggerDocProduct = require('./swagger/produit.json');
const swaggerDocRole = require('./swagger/role.json');
const swaggerDocStock = require('./swagger/stock.json');
const swaggerDocUser = require('./swagger/user.json');
const swaggerDocAuth = require('./swagger/auth.json');
const swaggerDocVente = require('./swagger/vente.json');
var options = {
    swaggerOptions: {
        validatorUrl: null
    }
};
app.use('/api-docs-cats', swaggerUi.serveFiles(swaggerDocCatProd, options), swaggerUi.setup(swaggerDocCatProd));
app.use('/api-docs-es', swaggerUi.serveFiles(swaggerDocES, options), swaggerUi.setup(swaggerDocES));
app.use('/api-docs-facts', swaggerUi.serveFiles(swaggerDocFact, options), swaggerUi.setup(swaggerDocFact));
app.use('/api-docs-lcoms', swaggerUi.serveFiles(swaggerDocLComs, options), swaggerUi.setup(swaggerDocLComs));
app.use('/api-docs-prods', swaggerUi.serveFiles(swaggerDocProduct, options), swaggerUi.setup(swaggerDocProduct));
app.use('/api-docs-roles', swaggerUi.serveFiles(swaggerDocRole, options), swaggerUi.setup(swaggerDocRole));
app.use('/api-docs-stocks', swaggerUi.serveFiles(swaggerDocStock, options), swaggerUi.setup(swaggerDocStock));
app.use('/api-docs-users', swaggerUi.serveFiles(swaggerDocUser, options), swaggerUi.setup(swaggerDocUser));
app.use('/api-docs-auth', swaggerUi.serveFiles(swaggerDocAuth, options), swaggerUi.setup(swaggerDocAuth));
app.use('/api-docs-ventes', swaggerUi.serveFiles(swaggerDocVente, options), swaggerUi.setup(swaggerDocVente));


//Set all routes from routes folder
app.use("/", routes);

// start express server
let port = process.env.PORT;
app.listen(port, () => {
    console.log("Server started at https://localhost:" + port);
});
