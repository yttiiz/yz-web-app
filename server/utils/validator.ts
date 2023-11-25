import { oak } from "@deps";
import { FormDataType } from "@components";

export class Validator {

  public static normalizeString(str: string) {
    return str.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  public static limitDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return {
      min: `${year}-${month}-${day}`,
    };
  }

  public static limitAge(
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

  public  static minAndMaxDateParser(label: string) {
    return label.includes("naissance") 
      ? (
        `min="${Validator.limitAge().min}"
          max="${Validator.limitAge().max}"`
        )
      : (
        `min="${Validator.limitDates().min}"`
      );
  }

  public static dataParser(
    data: oak.FormDataBody,
    dataModel: FormDataType,
  ):
    | { isOk: false; message: string }
    | { isOk: true; data: oak.FormDataBody } {
    const UNAUTHORIZED_CHARACTER = /[^\w\s\-@.\u00C0-\u00FF]/g;
    let key = 0, isOk = true;
    let message = "Il semble que votre saisie contient :";
    const messageLength = message.length;
    const isMsgSet = (message: string) => message.length !== messageLength;

    // CHECK FIELDS
    for (const prop in data.fields) {
      // Check unauthorized character.
      if (data.fields[prop].search(UNAUTHORIZED_CHARACTER) !== -1) {
        message += " des caractères non autorisés.";
        isOk = false;
        break;
      }

      // Check fields content length.
      if (
        dataModel.content[key].maxLength &&
        (data.fields[prop].length > +(dataModel.content[key].maxLength!))
      ) {
        message += isMsgSet(message)
        ? (message.replace(".", "") + " et en nombre trop importants.")
        : " des caractères en nombre trop importants.";
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
          message += ` ${isMsgSet(message)
            ? "Et "
            : ""
          } un fichier de type ${extFile} qui n'est pas pris en charge.`;
          isOk = false;
          break;
        }
      }

      index++;
      
    }

    return isOk ? { isOk, data } : { isOk, message };
  }
}
