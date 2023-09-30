import { oak } from "../dependencies/deps.ts";
import { FindCursorType, UserSchemaType, UserSchemaWithIDType } from "@mongo";

type CtxType =
  | number
  | string
  | { [x: string | number]: string | number };

export type AuthPathType =
  | "/"
  | "/register"
  | "/login"
  | "/update";

//Router
export type RouterAppType = oak.Router<Record<string, CtxType>>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

//Files
export type FilesDataType = oak.FormDataFile[];
export type PageDataIdType = `data-${string}`;

//DB
export type UserDataType = Record<number, UserSchemaWithIDType>;
export type GetCollectionType = (collection: string) => Promise<FindCursorType>;
export type InsertIntoDBType = (
  data: UserSchemaType,
  collection: string,
) => Promise<string>;
export type SelectFromDBType = (
  data: string,
  collection: string,
) => Promise<UserSchemaWithIDType | Record<string, string>>;
