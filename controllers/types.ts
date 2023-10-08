import { oak } from "@deps";
import { FindCursorType, UserSchemaType, UserSchemaWithIDType } from "@mongo";
import { AppState } from "@utils";

export type AuthPathType =
  | "/"
  | "/register"
  | "/login"
  | "/update";

//Router
export type RouterAppType = oak.Router<AppState>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

//Files
export type FilesDataType = oak.FormDataFile[];
export type PageDataIdType = `data-${string}`;

//DB
export type UserNotFoundMessageType = { message: string };
export type UserDataType = Record<number, UserSchemaWithIDType>;
export type GetCollectionType = (collection: string) => Promise<FindCursorType>;
export type InsertIntoDBType = (
  data: UserSchemaType,
  collection: string,
) => Promise<string>;
export type SelectFromDBType = (
  data: string,
  collection: string,
) => Promise<UserSchemaWithIDType | UserNotFoundMessageType>;
