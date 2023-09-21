import { oak } from "@depts";
import { ApiController, AuthController, HomeController } from "@controllers";
import {
  connectionToUsers,
  insertDataIntoDB,
  selectUserFromDB,
} from "../mongo/mod.ts";

//Creating 'Router'.
export const router = new oak.Router();

//Creating all 'Routes' controllers.
new AuthController(router, insertDataIntoDB, selectUserFromDB);
new HomeController(router);
new ApiController(router, connectionToUsers);
