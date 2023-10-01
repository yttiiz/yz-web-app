import { UserSchemaType, UserSchemaWithIDType } from "./mod.ts";
import { MongoClient, MongoStore } from "@deps";

/**
 * The app MongoDB Manager.
 * @property
 */
export class Mongo {
  private static client = new MongoClient();

  public static async connectionTo(collection: string) {
    const users = await Mongo.clientConnectTo(collection);
    return users.find();
  }

  public static async insertIntoDB(
    data: UserSchemaType,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo(collection);
    const id = await users.insertOne(data);
    return id.toHexString();
  }

  public static async selectFromDB(
    data: string,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo(collection);
    const user = await users.findOne({ email: data });

    if (user) return user;

    return { message: "aucun utilisateur trouvé." };
  }

  public static async setStore() {
    const db = await Mongo.client.connect(
      Deno.env.get("DATABASE_URL") as string,
    );
    return new MongoStore(db, "session");
  }

  private static async clientConnectTo(collection: string) {
    const db = await Mongo.client.connect(
      Deno.env.get("DATABASE_URL") as string,
    );
    return db.collection<UserSchemaWithIDType>(collection);
  }
}
