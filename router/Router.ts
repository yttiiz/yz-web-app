import { oak } from '../dependencies/dept.ts';
import { AuthController, HomeController, ApiController } from '../controllers/mod.ts';
import { connectionToUsers, selectUserFromDB, insertDataIntoDB } from '../mongo/mod.ts';

//Creating 'Router'.
export const router = new oak.Router();

//Creating all 'Routes' controllers.
new AuthController(router, insertDataIntoDB, selectUserFromDB);
new HomeController(router);
new ApiController(router, connectionToUsers);