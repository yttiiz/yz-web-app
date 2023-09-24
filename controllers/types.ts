import { oak } from "@deps";
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
export type GetCollectionType = () => Promise<FindCursorType>;
export type InsertIntoDBType = (data: UserSchemaType) => Promise<string>;
export type SelectFromDBType = (
  data: string,
) => Promise<UserSchemaWithIDType | string>;
