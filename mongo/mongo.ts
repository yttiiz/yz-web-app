import { UserSchemaType, UserSchemaWithIDType } from "./mod.ts";
import { MongoClient } from "@deps";

const client = new MongoClient();
const clientConnectTo = async (collection: string) => {
  const db = await client.connect("mongodb://localhost:27017/main");
  return db.collection<UserSchemaWithIDType>(collection);
};

export const connectionToUsers = async () => {
  const users = await clientConnectTo("users");
  return users.find();
};

export const insertUserIntoDB = async (data: UserSchemaType) => {
  const users = await clientConnectTo("users");
  const id = await users.insertOne(data);
  return id.toHexString();
};

export const selectUserFromDB = async (data: string) => {
  const users = await clientConnectTo("users");
  const user = await users.findOne({ email: data });

  if (user) return user;

  return "no user found";
};
