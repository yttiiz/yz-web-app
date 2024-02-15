import { Session } from "@deps";
import { BookingsType } from "@mongo";

export type AppState = {
  session: Session;
};

export type ContentHeadersType = {
  name: string;
  value: string;
};

export type DataParserReturnType =
  | { isOk: false; message: string }
  | { isOk: true; data: Record<string, FormDataEntryValue> };

export type ReturnBookingAvailabilityType = {
  isAvailable: false;
  booking: BookingsType;
} | {
  isAvailable: true;
};

export type FormDataAppType = {
  lastname: string;
  firstname: string;
  email: string;
  birth: string;
  password: string;
  job: string;
  photo: File | undefined,
};

export type CredentialsDataType = {
  email: string;
  username: string;
  password: string;
};

export type ClientMailType = "outlook" | "hostinger";

export type CredentialsType = Record<
  ClientMailType,
  CredentialsDataType
>;

export type SendParameterType = {
  to: string;
  receiver: string;
};

export type MailConfigType = {
  host: string;
  port: number;
  secure: boolean;
};