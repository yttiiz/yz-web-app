import { oak } from "@deps";
import { ApiController, AuthController, HomeController } from "@controllers";
import { Mongo } from "@mongo";

//Creating 'Router'.
export const router = new oak.Router();

//Creating all 'Routes' controllers.
new AuthController(router, Mongo.insertUserIntoDB, Mongo.selectUserFromDB);
new HomeController(router);
new ApiController(router, Mongo.connectionToUsers);
