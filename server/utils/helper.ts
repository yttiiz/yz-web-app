import { FilesDataType, Validator } from "./mod.ts";

export class Helper {
  private static baseDateOpts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  
  private static longDateOpts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  private static shortDateOpts: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  };

  private static WriteOpts: Deno.WriteFileOptions = {
    append: true,
  };

  public static async convertJsonToObject(
    path: string,
    decoder = new TextDecoder("utf-8"),
  ) {
    const file = await Deno.readFile(Deno.cwd() + path);

    return JSON.parse(decoder.decode(file));
  }

  public static async writeLog(
    error: { message: string },
    encoder = new TextEncoder(),
  ) {
    const errorMsg = `(${Helper.displayDate()}) ${error.message},\n`;
    const content = encoder.encode(errorMsg);

    await Deno.writeFile("server/log/log.txt", content, Helper.WriteOpts);
  }

  public static async writeUserPicFile(
    files: FilesDataType,
    firstname: string,
    lastname: string,
  ) {
    firstname = Validator.normalizeString(firstname);
    lastname = Validator.normalizeString(lastname);
    const [file] = files;
    const ext = file.contentType.split("/").at(1) as string;
    const photo =
      `img/users/${firstname.toLowerCase()}_${lastname.toLowerCase()}.${ext}`;

    await Deno.writeFile(`public/${photo}`, file.content as Uint8Array);

    return photo;
  }

  public static formatPrice(price: number) {
    return Intl
      .NumberFormat("fr-FR", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "EUR",
      })
      .format(price);
  }

  public static displayDate(
    date?: number | Date,
    length: "base" | "long" | "short" = "long",
  ) {
    date = date ? date : new Date();
    return Intl
      .DateTimeFormat(
        "fr-FR",
        length === "long" 
          ? Helper.longDateOpts 
          : (length === "short" ? Helper.shortDateOpts: Helper.baseDateOpts),
      )
      .format(date)
      .replace(",", " à");
  }
}
