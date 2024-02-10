import { Document, oak, ObjectId } from "@deps";
import type {
  ProductSchemaType,
  ProductSchemaWithIDType,
  ReviewsProductSchemaType,
  ReviewsProductSchemaWithIDType,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
  UpdateItemIntoDBParameterType,
} from "@mongo";
import { AppState } from "@utils";

export type PathAppType =
  | "/"
  | "/register"
  | "/login"
  | "/logout"
  | "/admin-logout"
  | "/profil"
  | "/admin"
  | "/review-form";

export type IdsType =
  | "data-home"
  | "data-product"
  | "data-admin"
  | "data-user-form"
  | "data-profil-form"
  | "data-not-found"
  | "data-booking";

// Router
export type RouterAppType = oak.Router<AppState>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

// Response
export type DataResponseType =
  | string
  | UserSchemaWithIDType
  | Record<string, string | Record<string, string>>;

// Session
export type SessionType = {
  get: <T extends (string | "userId")>(value: T) => (
    T extends "userId" ? ObjectId : string
  );
  set: (key: string, value: unknown) => void;
  flash: (key: string, value: string | null) => void;
  has: (value: string) => boolean;
};

export type SessionAndDataType = {
  session: SessionType;
  isConnexionFailed: boolean;
  isAdminInterface: boolean;
};

// Page
export type ConfigPageType = {
  id: IdsType;
  css: string;
  data?: unknown;
  title?: string;
  path?: string;
};

export type ConfigMainHtmlType =
  & Omit<
    ConfigPageType,
    "css" | "title"
  >
  & {
    main: string;
    isUserConnected: boolean;
  };

// DB Generics
export type GetCollectionType = (
  collection: string,
) => Promise<Document | NotFoundMessageType>;

export type InsertIntoDBType<T> = (
  data: T,
  collection: string,
) => Promise<string>;

export type SelectFromDBType<T> = (
  collection: string,
  identifier?: string | ObjectId,
  key?: string,
) => Promise<T>;

export type UpdateToDBType<T> = (
  id: ObjectId,
  data: T,
  collection: string,
) => Promise<boolean>;

export type DeleteFromDBType = (
  id: ObjectId,
  collection: string,
) => Promise<number>;

export type DeleteItemParameterType<T extends string> = {
  ctx: RouterContextAppType<T>,
  collection: string;
  identifier: string;
};

export type NotFoundMessageType = { message: string };

// Users in DB
export type UserDataType = Record<
  number,
  & UserSchemaWithOptionalFieldsType
  & { _id?: ObjectId }
>;
export type InsertUserIntoDBType = InsertIntoDBType<UserSchemaType>;
export type SelectUserFromDBType = SelectFromDBType<
  UserSchemaWithIDType | NotFoundMessageType
>;
export type UpdateUserToDBType = UpdateToDBType<
  UserSchemaWithOptionalFieldsType
>;

// Products in DB
export type ProductsDataType = Record<
  number,
  ProductSchemaWithIDType & { reviews?: ReviewsProductSchemaWithIDType }
>;
export type InsertProductsDBType = InsertIntoDBType<ProductSchemaType>;
export type SelectProductFromDBType = SelectFromDBType<
  ProductSchemaWithIDType | NotFoundMessageType
>;

export type ProductAdminFormDataType = {
  name: string;
  type: string;
  area: string;
  rooms: string;
  price: string;
  description: string;
  thumbnail?: File;
  pictures?: File;
};

// Reviews & Bookings common types
export type HandleItemIntoDBType<T> = (
  id: ObjectId,
  data: T,
  collection: string,
  key: string,
) => Promise<boolean>;

export type AddNewItemIntoDBType<T> = HandleItemIntoDBType<T>;
export type RemoveItemFromDBType<T> = HandleItemIntoDBType<T>;

export type UpdateItemIntoDBType<T> = ({
  data,
  collection,
  key,
  itemKey,
  itemValue,
}: UpdateItemIntoDBParameterType<T>) => Promise<boolean>;

// Reviews in DB
export type InsertReviewIntoDBType = InsertIntoDBType<ReviewsProductSchemaType>;
export type SelectReviewFromDBType = SelectFromDBType<
  ReviewsProductSchemaWithIDType | NotFoundMessageType
>;
