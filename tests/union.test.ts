import { describe, expect, test } from "vitest";
import {
  Infer,
  boolean,
  initCorrettore,
  number,
  object,
  or,
  string,
  literal,
  union,
  url,
  optional,
} from "../src";
import { Equal, Expect } from "./helpers.types";

const c = initCorrettore([
  string,
  number,
  or,
  boolean,
  object,
  literal,
  union,
  url,
  optional,
]);

describe("or", () => {
  test("basic", () => {
    const schema = c.string().or(c.number()).or(c.boolean());
    expect(schema.parse("yay")).toEqual("yay");
    expect(schema.parse(42)).toEqual(42);
    expect(() => schema.parse({ x: 42 })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string | number | boolean>>;
  });

  test("literal", () => {
    const schema = c.literal("a").or(c.literal(42)).or(c.literal("b"));
    expect(schema.parse("a")).toEqual("a");
    expect(schema.parse(42)).toEqual(42);
    expect(() => schema.parse("aaa")).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, "a" | 42 | "b">>;
  });

  test("object", () => {
    const schema = c
      .object({ x: number() })
      .or(c.object({ y: string() }))
      .or(c.string());
    expect(schema.parse({ x: 42 })).toEqual({ x: 42 });
    expect(schema.parse({ y: "foo" })).toEqual({ y: "foo" });
    expect(schema.parse("foo")).toEqual("foo");
    expect(() => schema.parse({ x: "bar" })).toThrow();
    expect(() => schema.parse({ y: 42 })).toThrow();

    // strip keys in other schema
    expect(schema.parse({ x: 42, y: "foo" })).toEqual({ x: 42 });

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<
      Equal<SchemaType, { x: number } | { y: string } | string>
    >;
  });

  test("with nulls", () => {
    const schema = c.string().or(c.number()).or(c.boolean());
    expect(() => schema.parse(null)).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string | number | boolean>>;
  });
});

describe("union", () => {
  test("basic", () => {
    const schema = c.union([c.string(), c.number()]);
    expect(schema.parse("yay")).toEqual("yay");
    expect(schema.parse(42)).toEqual(42);
    expect(() => schema.parse({ x: 42 })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, string | number>>;
  });

  test("literals", () => {
    const schema = c.union([c.literal("hello"), c.number(), c.literal("hi")]);
    expect(schema.parse("hello")).toEqual("hello");
    expect(schema.parse(42)).toEqual(42);
    expect(() => schema.parse({ x: 42 })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, number | "hello" | "hi">>;
  });

  test("object", () => {
    const schema = c.union([
      c.object({ x: number() }),
      c.object({ y: string() }),
      c.string(),
    ]);
    expect(schema.parse({ x: 42 })).toEqual({ x: 42 });
    expect(schema.parse({ y: "foo" })).toEqual({ y: "foo" });
    expect(schema.parse("foo")).toEqual("foo");
    expect(() => schema.parse({ x: "bar" })).toThrow();
    expect(() => schema.parse({ y: 42 })).toThrow();

    expect(schema.parse({ x: 42, y: "foo" })).toEqual({ x: 42 });

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<
      Equal<SchemaType, { x: number } | { y: string } | string>
    >;
  });

  test("case from zod docs", () => {
    const optionalUrl = c.union([c.string().url().optional(), c.literal("")]);

    expect(optionalUrl.parse(undefined)).toBe(undefined);
    expect(optionalUrl.parse("")).toBe("");
    expect(optionalUrl.parse("https://zod.dev")).toBe("https://zod.dev");
    expect(() => optionalUrl.parse("not a valid url")).toThrow();
  });
});
