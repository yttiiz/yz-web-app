export class Helper {
  static async convertJsonToObject(path: string) {
    const decoder = new TextDecoder("utf-8");
    const file = await Deno.readFile(Deno.cwd() + path);

    return JSON.parse(decoder.decode(file));
  }

  static async writeLog(
    error: { message: string },
    encoder = new TextEncoder(),
    opts = { append: true },
  ) {
    const DateOpts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const date = Intl
      .DateTimeFormat("fr-FR", DateOpts)
      .format(new Date());

    const errorMsg = `(${date}) ${error.message},\n`;
    const content = encoder.encode(errorMsg);

    await Deno.writeFile("log/log.txt", content, opts);
  }
}
