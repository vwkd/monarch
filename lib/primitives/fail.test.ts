import { assertEquals } from "@std/assert";
import { fail, take } from "../main.ts";

Deno.test("fail is an absorbing element of bind", () => {
  assertEquals(fail.bind(() => take).parse("m"), fail.parse("m"));
  // assertEquals(take.bind(() => fail).parse("m"), fail.parse("m"));
});
