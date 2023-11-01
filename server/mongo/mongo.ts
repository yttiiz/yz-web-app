import {
  MongoClient,
  MongoStore,
  ObjectId
} from "@deps";
import type {
  Document,
  Filter,
  UpdateFilter
} from "@deps";

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

  public static async updateToDB<T extends Document>(
    id: ObjectId,
    data: T,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo<T>(collection);
    const {
      matchedCount,
      modifiedCount
    } = await users.updateOne(
      { _id: id },
      { $set: { ...data } } as unknown as UpdateFilter<T>,
    );

    return matchedCount + modifiedCount === 2;
  }

  public static async insertIntoDB<T extends Document>(
    data: T,
    collection: string,
  ) {
    const selectedCollection = await Mongo.clientConnectTo<T>(collection);
    const id: ObjectId = await selectedCollection.insertOne(data);
    return id.toHexString();
  }

  public static async selectFromDB<T extends Document>(
    email: string,
    collection: string,
  ) {
    const selectedCollection = await Mongo.clientConnectTo<T>(collection);
    const selectedDocument = await selectedCollection.findOne({ email } as unknown as Filter<T>);

    if (selectedDocument) return selectedDocument;

    return { message: "aucun utilisateur n'est lié à cet email : " + email };
  }

  public static async setStore() {
    const db = await Mongo.client.connect(
      Deno.env.get("DATABASE_URL") as string,
    );
    return new MongoStore(db, "session");
  }

  private static async clientConnectTo<T extends Document>(collection: string) {
    const db = await Mongo.client.connect(
      Deno.env.get("DATABASE_URL") as string,
    );
    return db.collection<T>(collection);
  }
}
