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
  reviewId: string;
  bookingId: string;
};

export type ProductBindingFieldsType = {
  productName: string;
  productId: string;
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

export type ReviewsProductSchemaType = ProductBindingFieldsType & {
  reviews: ReviewsType[];
};

export type ReviewsProductSchemaWithIDType = SchemaWithID<
  ReviewsProductSchemaType
>;
export type ReviewsProductSchemaWithOptionalFieldsType = Partial<
  ReviewsProductSchemaType
>;

export type FindCursorReviewProductType = FindCursor<ReviewsProductSchemaWithIDType>;

//Bookings types
export type BookingDateType = {
  startingDate: string;
  endingDate: string;
};

export type BookingsType = BookingDateType & {
  userId: string;
  userName: string;
};

export type BookingUserInfoType = (
  ProductBindingFieldsType &
  BookingDateType & {
    details: DetailsProductType
    thumbnail: ImagesProductType;
    rates: number[];
  }
);

export type BookingsProductSchemaType = ProductBindingFieldsType & {
  bookings: BookingsType[];
};

export type BookingsProductSchemaWithIDType = SchemaWithID<
  BookingsProductSchemaType
>;
export type BookingsProductSchemaWithOptionalFieldsType = Partial<
  ReviewsProductSchemaType
>;

export type FindCursorBookingsProductType = FindCursor<BookingsProductSchemaWithIDType>;

// Product & Reviews type
export type ProductFullDataType = {
  product: ProductSchemaWithIDType;
  reviews: ReviewsProductSchemaWithIDType;
  actualOrFutureBookings: BookingsType[];
};
