import { oak } from "@deps";
import { ApiController, AuthController, HomeController } from "@controllers";
import {
  connectionToUsers,
  insertUserIntoDB,
  selectUserFromDB,
} from "@mongo";

//Creating 'Router'.
export const router = new oak.Router();

//Creating all 'Routes' controllers.
new AuthController(router, insertUserIntoDB, selectUserFromDB);
new HomeController(router);
new ApiController(router, connectionToUsers);
