import { oak } from "@deps";
import type {
  FindCursorType,
  UserSchemaType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
  UserSchemaWithoutSensitiveData
} from "@mongo";
import { AppState } from "@utils";

export type PathType =
  | "/"
  | "/register"
  | "/login"
  | "/logout"
  | "/profil";

// Router
export type RouterAppType = oak.Router<AppState>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;

// Files
export type FilesDataType = oak.FormDataFile[];
export type PageDataIdType = `data-${string}`;

// DB
export type UserNotFoundMessageType = { message: string };
export type UserDataType = Record<number, UserSchemaWithoutSensitiveData>;
export type GetCollectionType = (collection: string) => Promise<FindCursorType>;
export type InsertIntoDBType = (
  data: UserSchemaType,
  collection: string,
) => Promise<string>;
export type SelectFromDBType = (
  email: string,
  collection: string,
) => Promise<UserSchemaWithIDType | UserNotFoundMessageType>;
export type UpdateToDBType = (
  email: string,
  data: UserSchemaWithOptionalFieldsType,
  collection: string,
) => Promise<boolean>;
