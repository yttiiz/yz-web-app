import { Document, oak, ObjectId } from "@deps";
import type {
  ProductSchemaType,
  ProductSchemaWithIDType,
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
  | "/profil";

// Router
export type RouterAppType = oak.Router<AppState>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

// Page
export type ConfigPageType = {
  id: `data-${string}`;
  data?: unknown;
  title?: string;
  path?: string;
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
  email: string,
  collection: string,
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

// Users in DB
export type UserNotFoundMessageType = { message: string };
export type UserDataType = Record<
  number,
  & UserSchemaWithOptionalFieldsType
  & { _id?: ObjectId }
>;
export type InsertUserIntoDBType = InsertIntoDBType<UserSchemaType>;
export type SelectUserFromDBType = SelectFromDBType<
  UserSchemaWithIDType | UserNotFoundMessageType
>;
export type UpdateUserToDBType = UpdateToDBType<
  UserSchemaWithOptionalFieldsType
>;

// Products in DB
export type ProductsDataType = Record<
  number,
  ProductSchemaWithIDType
>;
export type InsertProductsDBType = InsertIntoDBType<ProductSchemaType>;
