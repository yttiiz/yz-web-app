import { Collection, FindCursor, ObjectId } from "@deps";

export type UserSchemaType = {
  birth: Date;
  firstname: string;
  email: string;
  lastname: string;
  role: string;
  job: string;
  photo: string;
  hash: string;
  key: Uint8Array;
};

export type UserSchemaWithIDType = UserSchemaType & {
  _id: ObjectId;
};

export type CollectionType = Collection<UserSchemaWithIDType>;
export type FindCursorType = FindCursor<UserSchemaWithIDType>;
