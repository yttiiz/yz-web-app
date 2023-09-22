import { oak } from "@deps";
export type {
  FindCursorType,
  UserSchemaType,
  UserSchemaWithIDType,
} from "@mongo";

type CtxType =
  | number
  | string
  | { [x: string | number]: string | number };

export type AuthPathType = "/" | "/register" | "/login";
export type RouterAppType = oak.Router<Record<string, CtxType>>;
export type RouterContextAppType<T extends string> = oak.RouterContext<T>;
export type FilesDataType = oak.FormDataFile[];
export type PageDataIdType = `data-${string}`;
