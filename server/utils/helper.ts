import { Validator } from "./mod.ts";
import { Auth } from "@auth";
import type { UserSchemaWithIDType, UserSchemaWithOptionalFieldsType } from "@mongo";

type DisplayDateType = {
  date?: number | Date;
  style?: "normal" | "long" | "short";
};

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

  private static writeOpts: Deno.WriteFileOptions = {
    create: true,
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
    { message }: { message: string },
  ) {
    const errorMsg = `(${Helper.displayDate({})}) ${message},\n`;
    const content = new TextEncoder().encode(errorMsg);

    await Deno.writeFile("server/log/log.txt", content, Helper.writeOpts);
  }

  public static async writeEmailLog(
    message: string,
  ) {
    await Deno.writeFile(
      "server/log/email.txt", 
      new TextEncoder().encode(`${message},\n`),
      Helper.writeOpts,
    );
  }

  public static async writeUserPicFile(
    file: File,
    firstname: string,
    lastname: string,
  ) {
    firstname = Validator.normalizeString(firstname);
    lastname = Validator.normalizeString(lastname);

    const fullName = `${firstname.toLowerCase()}_${lastname.toLowerCase()}`;
    return await Helper.writePicture(file, fullName, "users"); 
  }

  public static async writePicFile(
    file: File,
    name: string,
  ) {
    name = Validator.normalizeString(name);

    return await Helper.writePicture(file, name, "products"); 
  }

  private static async writePicture(
    file: File,
    name: string,
    dir: string,
  ) {
    const ext = file.type.split("/").at(1) as string;
    const pic = `img/${dir}/${name}.${ext}`;

    await Deno.writeFile(`public/${pic}`, file.stream());

    return pic;
  }

  public static formatPrice(price: number) {
    return new Intl
      .NumberFormat("fr-FR", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "EUR",
      })
      .format(price);
  }

  public static displayDate({
    date,
    style = "long",
  }: DisplayDateType,
  ) {
    date = date ? date : new Date();
    return new Intl
      .DateTimeFormat(
        "fr-FR",
        style === "long" 
          ? Helper.longDateOpts 
          : (style === "short" ? Helper.shortDateOpts : Helper.baseDateOpts),
      )
      .format(date)
      .replace(",", " à");
  }

  public static async removeEmptyOrUnchangedFields(
    data: Record<string, FormDataEntryValue>,
    user: UserSchemaWithIDType,
    picPath?: string,
  ) {

    const trustData = Object.keys(data)
      .filter((key) => data[key] !== "" || data[key] !== undefined)
      .reduce((acc, key) => {

        if (data[key] instanceof File) {
          delete data[key];
          
          return acc;

        } else {
          if (user[key as keyof typeof user] !== data[key]) {
            key === "birth"
              ? acc["birth"] = new Date(data[key] as string)
              : acc[key as keyof Omit<typeof acc, "birth">] = data[key] as string;
    
            return acc;
          }

          return acc;
        }
      }, {} as UserSchemaWithOptionalFieldsType & { password?: string });

    if (trustData["password"]) {
      trustData["hash"] = await Auth.hashPassword(trustData["password"]);
    }

    delete trustData["password"];

    if (picPath) {
      trustData["photo"] = picPath;
    }

    return trustData;
  }
}
