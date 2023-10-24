import { Collection, FindCursor, ObjectId } from "@deps";

export type UserSchemaWithoutSensitiveData = {
  firstname: string;
  email: string;
  lastname: string;
  role: string;
  job: string;
  photo: string;
  birth: Date;
};

export type UserSchemaType = UserSchemaWithoutSensitiveData & {
  hash: string;
};

export type UserSchemaWithIDType = UserSchemaType & {
  _id: ObjectId;
};

export type UserSchemaWithOptionalFieldsType = Partial<UserSchemaType>;

export type CollectionType = Collection<UserSchemaWithIDType>;
export type FindCursorType = FindCursor<UserSchemaWithIDType>;
