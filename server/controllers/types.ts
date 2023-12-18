import { Document, oak, ObjectId } from "@deps";
import type {
  ProductSchemaType,
  ProductSchemaWithIDType,
  ReviewsProductSchemaType,
  ReviewsProductSchemaWithIDType,
  ReviewsType,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import { AppState } from "@utils";

export type PathAppType =
  | "/"
  | "/register"
  | "/login"
  | "/logout"
  | "/profil"
  | "/review-form";

export type IdsType =
  | "data-home"
  | "data-product"
  | "data-user-form"
  | "data-profil-form"
  | "data-not-found";

// Router
export type RouterAppType = oak.Router<AppState>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

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
) => Promise<Document | undefined>;
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

// Reviews in DB
export type InsertReviewIntoDBType = InsertIntoDBType<ReviewsProductSchemaType>;
export type SelectReviewFromDBType = SelectFromDBType<
  ReviewsProductSchemaWithIDType | NotFoundMessageType
>;
export type AddNewItemIntoReviewType = (
  id: ObjectId,
  data: ReviewsType,
  collection: string,
) => Promise<boolean>;
