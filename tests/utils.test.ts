import { assertEquals } from "./deps.ts";
import { Helper, Validator } from "../server/utils/mod.ts";

const task = (str: TemplateStringsArray, utility = "Helper") => (
  `${utility} -> method (${str[0]})`
);

Deno.test({
  name: task`convert json to object`,
  async fn() {
    assertEquals(
      { firstname: "John", lastname: "Doe", age: 45 },
      await Helper.convertJsonToObject("/tests/data.test.json"),
    );
  },
});

Deno.test({
  name: task`formate price`,
  fn() {
    assertEquals("35,25\xa0€", Helper.formatPrice(35.25));
  },
});

Deno.test({
  name: task`display date`,
  fn() {
    assertEquals(
      "24 juil. 1980",
      Helper.displayDate({
        date: new Date("1980-7-24"),
        style: "normal",
      }),
    );
  },
});

Deno.test({
  name: task`normalise string (NFD)${"Validator"}`,
  fn() {
    assertEquals("aeeui", Validator.normalizeString("àéèùï"));
  },
});

Deno.test({
  name: task`limit dates${"Validator"}`,
  fn() {
    assertEquals({ min: "2024-04-25" }, Validator.limitDates("2024-04-25"));
  },
});

Deno.test({
  name: task`limit age${"Validator"}`,
  fn() {
    const getDate = (num: number) => {
      let [year, month, day] = (
        new Date().toISOString().split("T").at(0) as string
      ).split("-");
      year = `${+year - num}`;
      return `${year}-${month}-${day}`;
    };
    const min = getDate(100), max = getDate(18);
    assertEquals({ min, max }, Validator.limitAge());
  },
});

Deno.test({
  name: task`date parser limiter${"Validator"}`,
  fn() {
    const min = new Date().toISOString().split("T").at(0) as string;
    assertEquals(`min="${min}"`, Validator.minAndMaxDateParser("test"));
  },
});

Deno.test({
  name: task`form data parser${"Validator"}`,
  fn() {
    const dataModel = {
      action: "/test",
      method: "POST",
      title: "test",
      content: [
        { type: "text" },
        { type: "text" },
      ],
    };

    // Correct fields
    const fields1 = [
      { key: "name", value: "John" },
      { key: "age", value: "45" }
    ];
    const formData1 = new FormData();
    
    for (const { key, value } of fields1) {
      formData1.append(key, value);
    }

    // Unexpected fields
    const fields2 = [
      { key: "name", value: "(function(){document.querySelector(\"body\").innerHTML=\"\"})()"}
    ];
    const formData2 = new FormData();
    for (const { key, value} of fields2) {
      formData2.append(key, value);
    }

    assertEquals(
      { isOk: true, data: { name: "John", age: "45" } },
      Validator.dataParser(formData1, dataModel),
    );

    assertEquals(
      { isOk: false, message: "Il semble que votre saisie contient : des caractères non autorisés." },
      Validator.dataParser(formData2, dataModel)
    )
  },
});
