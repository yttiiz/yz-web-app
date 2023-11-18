import { FilesDataType, Validator } from "./mod.ts";

export class Helper {
  private static DateOpts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
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
    const errorMsg = `(${Helper.dateNow()}) ${error.message},\n`;
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

  private static dateNow() {
    return Intl
      .DateTimeFormat("fr-FR", Helper.DateOpts)
      .format(new Date());
  }
}
