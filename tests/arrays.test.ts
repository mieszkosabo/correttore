import { describe, expect, test } from "vitest";
import { initCorrettore, min, string, arrays, Infer, number } from "../src";
import { Equal, Expect } from "./helpers.types";

describe("arrays", () => {
  const c = initCorrettore([
    arrays.array,
    number,
    string,
    min,
    arrays.nonEmpty,
    arrays.min,
    arrays.max,
    arrays.length,
    arrays.element,
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

  test("element", () => {
    const schema = c.string().min(3).array().element;
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string>>;
    expect(schema.parse("hello")).toBe("hello");
    expect(() => schema.parse("ui")).toThrow();
  });

  test("element alt syntax", () => {
    const schema = c.array(c.string().min(3)).element;
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string>>;
    expect(schema.parse("hello")).toBe("hello");
    expect(() => schema.parse("ui")).toThrow();
  });

  test("element after other array methods", () => {
    const schema = c.array(c.string().min(3)).nonEmpty().min(5).max(10).element;
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string>>;
    expect(schema.parse("hello")).toBe("hello");
    expect(() => schema.parse("ui")).toThrow();
  });

  test("element after other array methods alt syntax", () => {
    const schema = c.string().min(3).array().nonEmpty().min(5).max(10).element;
    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string>>;
    expect(schema.parse("hello")).toBe("hello");
    expect(() => schema.parse("ui")).toThrow();
  });
});
