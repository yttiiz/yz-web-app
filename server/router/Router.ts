// TODO to be removed (reset "session" in BD)
import { ObjectId, FindCursor } from "../dependencies/deps.ts";
import { Http } from "@utils";
import { RouterContextAppType } from "../controllers/types.ts";
//

import { oak } from "@deps";
import {
  Mongo,
  ReviewsProductSchemaWithIDType,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import { AppState } from "@utils";
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
  Mongo.selectFromDB<UserSchemaWithIDType>,
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
  Mongo.updateToDB,
  Mongo.addNewItemIntoDB,
  Mongo.updateItemIntoDB,
);

// TODO to be removed (reset "session" in BD)
router.get(
  "/reset",
  async (ctx: RouterContextAppType<"/reset">) => {
    const sessions = await Mongo.connectionTo("session");
    type SessionDBType = {
      _id: ObjectId;
      id: string;
      data: {
        _flash: {
          message?: string
        }
      }
    };

    if ("message" in sessions) {
      return;
    } else {
      (sessions as FindCursor<SessionDBType>).map(
        async (session) => {
          const _id = session._id;
          if (!session.data._flash.message) {

            await Mongo.deleteFromDB(_id, "session");
          }
        }
      )
    }
    
    const url = new URL("/", Deno.env.get("APP_URL"));

    new Http(ctx)
    .setHeaders({
      name: "Content-Type",
      value: "application/json"

    })
    .redirect(url)
    .setResponse(JSON.stringify({ message: "session clean"}), 200)
  }
)