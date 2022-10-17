import { Router } from "express";
import cats from "./catProd.route";
import config from "./config.route";
import es from "./entreeStock.route";
import facts from "./facture.route";
import lcoms from "./lcommande.route";
import products from "./produit.route";
import stocks from "./stock.route";
import roles from "./role.route";
import users from "./user.route";
import ventes from "./vente.route";

const routes = Router();

routes.use("/cats", cats);
routes.use("/conf", config);
routes.use("/es", es);
routes.use("/facts", facts);
routes.use("/lcoms", lcoms);
routes.use("/prods", products);
routes.use("/stocks", stocks);
routes.use("/roles", roles);
routes.use("/users", users);
routes.use("/ventes", ventes);

export default routes;