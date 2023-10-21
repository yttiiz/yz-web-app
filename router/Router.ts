import { oak } from "@deps";
import { Mongo } from "@mongo";
import { AppState } from "@utils";
import {
  ApiController,
  AuthController,
  HomeController,
  ProfilController,
} from "@controllers";

export const router = new oak.Router<AppState>();

// Creating all 'Routes' controllers.
new AuthController(router, Mongo.insertIntoDB, Mongo.selectFromDB);
new ProfilController(router, Mongo.insertIntoDB, Mongo.selectFromDB);
new HomeController(router);
new ApiController(router, Mongo.connectionTo);
