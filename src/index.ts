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

//Set all routes from routes folder
app.use("/", routes);

// start express server
let port = process.env.PORT;
app.listen(port, () => {
    console.log("Server started at https://localhost:" + port);
});
