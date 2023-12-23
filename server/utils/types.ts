import { oak, Session } from "@deps";
import { BookingsType } from "@mongo";

export type AppState = {
  session: Session;
};

export type ContentHeadersType = {
  name: string;
  value: string;
};

export type FilesDataType = oak.FormDataFile[];

export type DataParserReturnType =
  | { isOk: false; message: string }
  | { isOk: true; data: oak.FormDataBody };

export type ReturnBookingAvailabilityType = {
  isAvailable: false;
  booking: BookingsType;
} | {
  isAvailable: true;
};
