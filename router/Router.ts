import { oak } from "@deps";
import { ApiController, AuthController, HomeController } from "@controllers";
import { Mongo } from "@mongo";
import { AppState } from "@utils";

export const router = new oak.Router<AppState>();

//Creating all 'Routes' controllers.
new AuthController(router, Mongo.insertIntoDB, Mongo.selectFromDB);
new HomeController(router);
new ApiController(router, Mongo.connectionTo);
