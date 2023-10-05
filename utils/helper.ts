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
    append: true
  };

  public static async convertJsonToObject(path: string) {
    const decoder = new TextDecoder("utf-8");
    const file = await Deno.readFile(Deno.cwd() + path);

    return JSON.parse(decoder.decode(file));
  }

  public static async writeKey(
    email: string,
    rawKey: Uint8Array,
    userInfo: string[],
    encoder = new TextEncoder(),

  ) {
    const text = `//${Helper.dateNow()}\nconst __${userInfo.join("")}__ = {\n\temail: "${email}",\n\trawKey: [${rawKey}],\n};\n\n`;
    const content = encoder.encode(text);

    await Deno.writeFile("log/user.key.ts", content, Helper.WriteOpts);
  }

  public static async writeLog(
    error: { message: string },
    encoder = new TextEncoder(),
  ) {
    const errorMsg = `(${Helper.dateNow()}) ${error.message},\n`;
    const content = encoder.encode(errorMsg);

    await Deno.writeFile("log/log.txt", content, Helper.WriteOpts);
  }

  private static dateNow() {
    return Intl
    .DateTimeFormat("fr-FR", Helper.DateOpts)
    .format(new Date());
  }
}
