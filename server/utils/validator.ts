import { oak } from "@deps";
import { FormDataType, InputDataType } from "@components";

export class Validator {
  private static message = "des caractères suspects ont été détectés.";
  
  public static normalizeString(str: string) {
    return str.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  public static dataParser(
    data: oak.FormDataBody,
    dataStructure: FormDataType
  ): (
    | { isDataOk: false; message: string }
    | { isDataOk: true; data: oak.FormDataBody }
  ) {
    const UNAUTHORIZED_CHARACTER = /[^\w@.]/g;
    let i = 0, isDataOk = true;

    // CHECK FIELDS
    for (const prop in data.fields) {
      // Check unauthorized character.
      if (data.fields[prop].search(UNAUTHORIZED_CHARACTER) !== -1) {
        isDataOk = false;
        
        return { isDataOk, message: Validator.message };
      }

      // Check fields content length.
      if (dataStructure.content[i].maxLength) {
        data.fields[prop].length > +(dataStructure.content[i].maxLength!)
          ? isDataOk = false
          : isDataOk = true;
        
        return isDataOk
         ? { isDataOk, data }
         : { isDataOk, message: Validator.message };
      }

      i++;
    }

    //CHECK FILES
    //TODO implements logic.

    return { isDataOk, data };
  }
}
