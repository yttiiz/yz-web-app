import { Collection, FindCursor, ObjectId } from "@deps";

// Users types
export type UserType = {
  firstname: string;
  lastname: string;
  email: string;
  job: string;
  photo: string;
  role: string;
  birth: Date;
};

export type UserSchemaType = UserType & {
  hash: string;
};

export type UserSchemaWithIDType = UserSchemaType & {
  _id: ObjectId;
};

export type UserSchemaWithOptionalFieldsType = Partial<UserSchemaType>;

export type CollectionUserType = Collection<UserSchemaWithIDType>;
export type FindCursorUserType = FindCursor<UserSchemaWithIDType>;

// Products types
type ReviewType = {
  id: string;
  senderId: string;
  review: string;
}

type RateType = {
  excellent: number;
  good: number;
  quiteGood: number;
  bad: number;
  execrable: number
};

export type ProductSchemaType = {
  name: string;
  type: string;
  description: string;
  thumbnail: string;
  pictures: string[];
  rate: RateType,
  review: ReviewType[];
}
export type ProductSchemaWithIDType = ProductSchemaType & {
  _id: ObjectId;
};

export type ProductSchemaWithOptionalFieldsType = Partial<ProductSchemaType>
export type FindCursorProductType = FindCursor<ProductSchemaWithIDType>;