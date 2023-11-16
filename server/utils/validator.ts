import { oak } from "@deps";
import { FormDataType } from "@components";

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
    const UNAUTHORIZED_CHARACTER = /[^\w@.\u00C0-\u00FF]/g;
    let key = 0, index = 0, isDataOk = true;

    // CHECK FIELDS
    for (const prop in data.fields) {
      // Check unauthorized character.
      if (data.fields[prop].search(UNAUTHORIZED_CHARACTER) !== -1) {
        isDataOk = false;
        
        return { isDataOk, message: Validator.message };
      }

      // Check fields content length.
      if (dataStructure.content[key].maxLength) {
        data.fields[prop].length > +(dataStructure.content[key].maxLength!)
          ? isDataOk = false
          : isDataOk = true;
        
        return isDataOk
         ? { isDataOk, data }
         : { isDataOk, message: Validator.message };
      }

      key++;
    }

    //CHECK FILES
    if (data.files && dataStructure.content[index].accept) {
      for (const file of data.files) {
        const extension = file.contentType.split("/").at(1) as string;

        console.log(extension)
        
        dataStructure.content[index].accept!.split(",")
        .forEach((ext) => {
          ext.includes(extension.replace(".", ""))
           ? isDataOk = true
           : isDataOk = false;
        });
       
        if (!isDataOk) {
          return { isDataOk, message: Validator.message };
        }
        
        index++;
      }
    }

    return { isDataOk, data };
  }
}
