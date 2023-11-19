import { oak } from "@deps";
import {
  Mongo,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import type { AppState } from "@utils";
import {
  ApiController,
  AuthController,
  HomeController,
  ProductController,
  ProfilController,
} from "@controllers";

export const router = new oak.Router<AppState>();

// Creating all 'Routes' controllers.
new HomeController(
  router,
  Mongo.connectionTo,
);
new AuthController(
  router,
  Mongo.insertIntoDB<UserSchemaType>,
  Mongo.selectFromDB<UserSchemaWithIDType>,
);
new ProfilController(
  router,
  Mongo.updateToDB<UserSchemaWithOptionalFieldsType>,
  Mongo.deleteFromDB,
);
new ProductController(
  router,
);
new ApiController(
  router,
  Mongo.connectionTo,
  Mongo.selectFromDB<UserSchemaWithIDType>,
);
