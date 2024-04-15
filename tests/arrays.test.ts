import { describe, expect, test } from "bun:test";
import { initCorrettore, min, string, arrays, Infer } from "../src";
import { Equal, Expect } from "./helpers.types";

describe("arrays", () => {
  const c = initCorrettore([
    arrays.array,
    string,
    min,
    arrays.nonEmpty,
    arrays.min,
    arrays.max,
    arrays.length,
  ]);

  test("arrays", () => {
    expect(() => c.array(c.string().min(2)).parse(["ab", "ba"])).not.toThrow();
    expect(() => c.array(c.string()).parse([])).not.toThrow();
    expect(() => c.array(c.string()).parse([42])).toThrow();
    expect(() =>
      c.array(c.string()).nonEmpty().parse(["a", "b"]),
    ).not.toThrow();
    expect(() => c.array(c.string()).nonEmpty().parse([])).toThrow();
    expect(() =>
      c
        .array(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "c", "d"]),
    ).not.toThrow();
    expect(() =>
      c
        .array(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "d"]),
    ).toThrow();

    const schema = c.array(c.string());
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string[]>>;
  });

  test("arrays alternative syntax", () => {
    expect(() => c.string().min(2).array().parse(["ab", "ba"])).not.toThrow();
    expect(() => c.string().array().parse([])).not.toThrow();
    expect(() => c.string().array().parse([42])).toThrow();
    expect(() => c.string().array().nonEmpty().parse(["a", "b"])).not.toThrow();
    expect(() => c.string().array().nonEmpty().parse([])).toThrow();
    expect(() =>
      c
        .string()
        .array()
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "c", "d"]),
    ).not.toThrow();
    expect(() =>
      c
        .string()
        .array()
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "d"]),
    ).toThrow();

    const schema = c.string().array();
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string[]>>;
  });
});
