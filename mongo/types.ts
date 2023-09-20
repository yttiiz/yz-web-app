import { Collection, FindCursor, ObjectId } from "@depts";

export type UserSchemaType = {
  dateOfBirth: Date;
  firstname: string;
  email: string;
  lastname: string;
  role: string;
  job: string;
  photo: string;
  // __v: number;
  // hash: string;
  // salt: string;
  // token: string;
};

export type UserSchemaWithIDType = UserSchemaType & {
  _id: ObjectId;
};

export type CollectionType = Collection<UserSchemaWithIDType>;
export type FindCursorType = FindCursor<UserSchemaWithIDType>;
