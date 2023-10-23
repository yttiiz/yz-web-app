import { MongoClient, MongoStore } from "@deps";
import type {
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType
} from "./mod.ts";

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

  public static async updateToDB(
    email: string,
    data: UserSchemaWithOptionalFieldsType,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo(collection);
    const { matchedCount, modifiedCount } = await users.updateOne({ email }, { $set: { ...data } });

    return matchedCount + modifiedCount === 2;
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
    email: string,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo(collection);
    const user = await users.findOne({ email });

    if (user) return user;

    return { message: "aucun utilisateur n'est lié à cet email : " + email };
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
