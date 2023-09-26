import { UserSchemaType, UserSchemaWithIDType } from "./mod.ts";
import { MongoClient } from "@deps";

export class Mongo {
  private static client = new MongoClient();

  public static connectionTo = async (collection: string) => {
    const users = await Mongo.clientConnectTo(collection);
    return users.find();
  };

  public static insertIntoDB = async (
    data: UserSchemaType,
    collection: string,
  ) => {
    const users = await Mongo.clientConnectTo(collection);
    const id = await users.insertOne(data);
    return id.toHexString();
  };

  public static selectFromDB = async (data: string) => {
    const users = await Mongo.clientConnectTo("users");
    const user = await users.findOne({ email: data });

    if (user) return user;

    return "no user found";
  };

  private static clientConnectTo = async (collection: string) => {
    const db = await Mongo.client.connect(
      Deno.env.get("DATABASE_URL") as string,
    );
    return db.collection<UserSchemaWithIDType>(collection);
  };
}
