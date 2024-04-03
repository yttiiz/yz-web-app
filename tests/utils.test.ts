import { assertEquals } from "./deps.ts";
import { Helper } from "../server/utils/mod.ts";

const helper = (str: TemplateStringsArray) => (
  `Helper - method (${str[0]})`
);

Deno.test({
  name: helper`convert json to object`,
  async fn() {
    assertEquals(
      { firstname: "John", lastname: "Doe", age: 45 },
      await Helper.convertJsonToObject("/tests/data.test.json")
    );
  },
});

Deno.test({
  name: helper`formate price`,
  fn() {
    assertEquals("35,25\xa0€", Helper.formatPrice(35.25));
  },
});

Deno.test({
  name: helper`display date`,
  fn() {
    assertEquals("24 juil. 1980", Helper.displayDate({ date: new Date("1980-7-24"), style: "normal"}))
  }
})