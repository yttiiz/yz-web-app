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
};

export type UserSchemaWithIDType = UserSchemaType & {
  _id: ObjectId;
};

export type UserSchemaWithOptionalFieldsType = Partial<UserSchemaType>;

export type CollectionType = Collection<UserSchemaWithIDType>;
export type FindCursorType = FindCursor<UserSchemaWithIDType>;
