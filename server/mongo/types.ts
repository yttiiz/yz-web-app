import { Collection, FindCursor, ObjectId } from "@deps";

type SchemaWithID<T> = T & {
  _id: ObjectId;
};

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

export type UserSchemaWithIDType = SchemaWithID<UserSchemaType>;

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

export enum RateProductEnum {
  excellent = 5,
  good = 4,
  quiteGood = 3,
  bad = 2,
  execrable = 1,
}

export type DetailsProductType = {
  rooms: number;
  area: number;
  price: number;
  available: boolean;
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
  reviewId: string;
};

export type ProductSchemaWithIDType = SchemaWithID<ProductSchemaType>;

export type ProductSchemaWithOptionalFieldsType = Partial<ProductSchemaType>;
export type FindCursorProductType = FindCursor<ProductSchemaWithIDType>;

// Reviews types
export type ReviewsType = {
  userId: string;
  userName: string;
  rate: number;
  comment: string;
  timestamp: number;
};

export type ReviewsProductSchemaType = {
  productName: string;
  productId: string;
  reviews: ReviewsType[];
};

export type ReviewsProductSchemaWithIDType = SchemaWithID<ReviewsProductSchemaType>;
export type ReviewsProductSchemaWithOptionalFieldsType = Partial<ReviewsProductSchemaType>;

// Product & Reviews type
export type ProductAndReviewsType = {
  product: ProductSchemaWithIDType;
  reviews: ReviewsProductSchemaWithIDType;
};
