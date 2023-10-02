import { uuid } from "@deps";

const myUUID = crypto.randomUUID();
console.log("Random UUID:", myUUID);

console.log(uuid.validate("not a UUID")); // false
console.log(uuid.validate("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b")); // true

console.log(uuid.v1.generate());

const NAMESPACE_URL = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const data = new TextEncoder().encode("deno.land");
console.log(await uuid.v5.generate(NAMESPACE_URL, data));