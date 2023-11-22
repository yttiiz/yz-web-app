import { oak } from "@deps";
import { FormDataType } from "@components";

export class Validator {
  private static message =
    "Il semble que votre saisie contient des caractères soit, non autorisés, ou soit, en nombre trop importants.";

  public static normalizeString(str: string) {
    return str.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  public static limitDates(
    MAJORITY = 18,
    CENTURY = 100,
    ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return {
      min: `${year - CENTURY}-${month}-${day}`,
      max: `${year - MAJORITY}-${month}-${day}`,
    };
  }

  public static dataParser(
    data: oak.FormDataBody,
    dataModel: FormDataType,
  ):
    | { isOk: false; message: string }
    | { isOk: true; data: oak.FormDataBody } {
    const UNAUTHORIZED_CHARACTER = /[^\w\s\-@.\u00C0-\u00FF]/g;
    let key = 0, isOk = true;

    // CHECK FIELDS
    for (const prop in data.fields) {
      // Check unauthorized character.
      if (data.fields[prop].search(UNAUTHORIZED_CHARACTER) !== -1) {
        isOk = false;
        break;
      }

      // Check fields content length.
      if (
        dataModel.content[key].maxLength &&
        (data.fields[prop].length > +(dataModel.content[key].maxLength!))
      ) {
        isOk = false;
        break;
      }

      key++;
    }

    //CHECK FILES
    if (data.files) {
      const [photoModel] = dataModel.content
        .filter((item) => item.name === "photo");

      let index = 0;

      for (const file of data.files) {
        const extFile = file.contentType.split("/").at(1) as string;

        if (photoModel.accept && photoModel.accept.includes(extFile)) {
          isOk = true;
        } else {
          isOk = false;
          break;
        }
      }

      index++;
      
    }

    return isOk ? { isOk, data } : { isOk, message: Validator.message };
  }
}
