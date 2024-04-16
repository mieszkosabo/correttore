import { describe, expect, test } from "vitest";
import { Infer, coerce, initCorrettore } from "../src";
import { Equal, Expect } from "./helpers.types";

describe("coerce", () => {
  const c = initCorrettore([
    coerce.coerce,
    coerce.stringCoerce,
    coerce.booleanCoerce,
    coerce.numberCoerce,
    coerce.bigintCoerce,
    coerce.dateCoerce,
  ]);

  test("coerce", () => {
    const schema = c.coerce.string();
    expect(schema.parse("howdy")).toBe("howdy");
    expect(schema.parse(42)).toBe("42");

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string>>;
  });

  test("autocompletion", () => {
    // @ts-expect-error this should't be available
    expect(() => c.boolean()).toThrow();

    // @ts-expect-error this should't be available
    expect(() => c.string()).toThrow();

    c.coerce.boolean();
    c.coerce.string();
  });
});
