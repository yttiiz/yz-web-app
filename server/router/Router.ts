import { oak } from "@deps";
import {
  Mongo,
  ReviewsProductSchemaWithIDType,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import type { AppState } from "@utils";
import {
  AdminController,
  ApiController,
  AuthController,
  BookingController,
  HomeController,
  ProductController,
  ProfilController,
} from "@controllers";

export const router = new oak.Router<AppState>();

// Creating all 'Routes' controllers.
new HomeController(
  router,
  Mongo.connectionTo,
  Mongo.selectFromDB<ReviewsProductSchemaWithIDType>,
);
new AuthController(
  router,
  Mongo.connectionTo,
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
  Mongo.addNewItemIntoDB,
  Mongo.selectFromDB,
);
new BookingController(
  router,
  Mongo.connectionTo,
  Mongo.removeItemFromDB,
);
new ApiController(
  router,
  Mongo.connectionTo,
  Mongo.selectFromDB<UserSchemaWithIDType>,
);
new AdminController(
  router,
  Mongo.connectionTo,
  Mongo.selectFromDB,
);
