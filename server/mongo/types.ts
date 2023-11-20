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
export type ReviewProductType = {
  id: string;
  senderId: string;
  review: string;
};

export type RateProductType = {
  excellent: number;
  good: number;
  quiteGood: number;
  bad: number;
  execrable: number;
};

export type DetailsProductType = {
  rooms: number;
  area: number;
  price: number;
  type: string;
};

export type ImagesProductType = {
  src: string;
  alt: string;
};

export type ProductSchemaType = {
  name: string;
  description: string;
  details: DetailsProductType;
  thumbnail: ImagesProductType;
  pictures: ImagesProductType[];
  rate: RateProductType;
  review: ReviewProductType[];
};

export type ProductSchemaWithIDType = ProductSchemaType & {
  _id: ObjectId;
};

export type ProductSchemaWithOptionalFieldsType = Partial<ProductSchemaType>;
export type FindCursorProductType = FindCursor<ProductSchemaWithIDType>;
