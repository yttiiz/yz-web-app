import { MongoClient, MongoStore, ObjectId } from "@deps";
import type { Document, Filter, UpdateFilter } from "@deps";
import { Helper } from "@utils";

/**
 * The app MongoDB Manager.
 */
export class Mongo {
  private static client = new MongoClient();
  private static errorMsg = "connexion failed";

  public static async connectionTo(collection: string) {
    const users = await Mongo.clientConnectTo(collection);
    return users?.find();
  }

  public static async updateToDB<T extends Document>(
    id: ObjectId,
    data: T,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo<T>(collection);

    if (users) {
      const {
        matchedCount,
        modifiedCount,
      } = await users.updateOne(
        { _id: id },
        { $set: { ...data } } as unknown as UpdateFilter<T>,
      );

      return matchedCount + modifiedCount === 2;
    } else return false;
  }

  public static async insertIntoDB<T extends Document>(
    data: T,
    collection: string,
  ) {
    const selectedCollection = await Mongo.clientConnectTo<T>(collection);

    if (selectedCollection) {
      const id: ObjectId = await selectedCollection.insertOne(data);
      return id.toHexString();
    } else return Mongo.errorMsg;
  }

  public static async selectFromDB<T extends Document>(
    collection: string,
    identifier?: string | ObjectId,
  ) {
    const selectedCollection = await Mongo.clientConnectTo<T>(collection);
    const filter = typeof identifier === "string"
      ? { identifier } as unknown as Filter<T>
      : { _id: identifier };

    if (selectedCollection) {
      const selectedDocument = await selectedCollection.findOne(filter);

      if (selectedDocument) {
        return selectedDocument;
      }

      const message = collection === "users"
        ? "Aucun utilisateur n'est lié à cet email : " + identifier
        : "Produit non trouvé.";

      return { message };
    } else return { message: Mongo.errorMsg };
  }

  public static async deleteFromDB<T extends Document>(
    id: ObjectId,
    collection: string,
  ) {
    const users = await Mongo.clientConnectTo<T>(collection);

    if (users) {
      return await users.deleteOne({ _id: id });
    }

    return 0;
  }

  public static async setStore() {
    try {
      const db = await Mongo.client.connect(
        Deno.env.get("DATABASE_URL") as string,
      );
      return new MongoStore(db, "session");
    } catch (error) {
      Helper.writeLog(error);
    }
  }

  private static async clientConnectTo<T extends Document>(collection: string) {
    try {
      const db = await Mongo.client.connect(
        Deno.env.get("DATABASE_URL") as string,
      );
      return db.collection<T>(collection);
    } catch (error) {
      Helper.writeLog(error);
    }
  }
}
