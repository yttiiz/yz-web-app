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
