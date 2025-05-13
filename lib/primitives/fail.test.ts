import { assertEquals } from "@std/assert";
import { any, fail } from "../main.ts";

Deno.test("fail is an absorbing element of chain", () => {
  assertEquals(fail.chain(() => any).parse("m"), fail.parse("m"));
  // assertEquals(any.chain(() => fail).parse("m"), fail.parse("m"));
});
