import { assertEquals } from "@std/assert";
import { fail, take } from "../main.ts";

Deno.test("fail is an absorbing element of chain", () => {
  assertEquals(fail.chain(() => take).parse("m"), fail.parse("m"));
  // assertEquals(take.chain(() => fail).parse("m"), fail.parse("m"));
});
