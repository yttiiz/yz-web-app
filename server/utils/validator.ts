export class Validator {
  public static normalizeString(str: string) {
    return str.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }
}
