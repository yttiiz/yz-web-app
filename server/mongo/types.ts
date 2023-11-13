import { Collection, FindCursor, ObjectId } from "@deps";
import { Decimal128 } from "mongoose";

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
export type ReviewType = {
  id: string;
  senderId: string;
  review: string;
}

export type RateType = {
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
  price: Decimal128;
  thumbnail: string;
  pictures: string[];
  rate: RateType,
  review: ReviewType[];
};

export type ProductSchemaWithIDType = ProductSchemaType & {
  _id: ObjectId;
};

export type ProductSchemaWithOptionalFieldsType = Partial<ProductSchemaType>
export type FindCursorProductType = FindCursor<ProductSchemaWithIDType>;