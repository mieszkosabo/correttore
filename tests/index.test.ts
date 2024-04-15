import { describe, expect, test } from "bun:test";
import {
  initCorrettore,
  string,
  min,
  number,
  email,
  Infer,
  object,
  nullable,
  optional,
  coerce,
} from "../src";
import { Equal, Expect } from "./helpers.types";
import {
  array,
  nonEmpty,
  min as arrayMin,
  max as arrayMax,
  length,
} from "../src/arrays";
import { literal } from "../src/literal";
import {
  set,
  nonEmpty as setNonEmpty,
  min as setMin,
  max as setMax,
  size as setSize,
} from "../src/sets";

describe("basic tests", () => {
  const c = initCorrettore([
    string,
    min,
    number,
    email,
    object,
    array,
    nonEmpty,
    arrayMin,
    arrayMax,
    length,
    nullable,
    literal,
    optional,
    set,
    setNonEmpty,
    setMin,
    setMax,
    setSize,
    coerce.coerce,
    coerce.stringCoerce,
    coerce.numberCoerce,
    coerce.booleanCoerce,
    coerce.dateCoerce,
    coerce.bigintCoerce,
  ]);

  test("smoke tests", () => {
    expect(() => c.number().parse(42)).not.toThrow();
    expect(() => c.number().parse("hello")).toThrow();
    expect(() => c.string().parse("hello")).not.toThrow();
    expect(() => c.string().parse(42)).toThrow();
    expect(() =>
      c
        .object({
          a: c.string(),
          b: c.number(),
        })
        .parse({
          a: "hello",
          b: 42,
        })
    ).not.toThrow();
  });

  test("all conditions in a chain are checked", () => {
    const schema = c.string().email().min(5);
    expect(() => schema.parse("aaa@a.pl")).not.toThrow();
    expect(() => schema.parse("aaapl.com")).toThrow();
    expect(() => schema.parse("a@e")).toThrow();
    expect(() => schema.parse(42)).toThrow();
  });

  test("types", () => {
    const schema = c.object({
      a: c.string().email().min(2),
      b: c.number(),
      c: c.object({
        d: c.string(),
      }),
    });

    type InferredSchema = Infer<typeof schema>;

    type typeTest = Expect<
      Equal<
        InferredSchema,
        {
          a: string;
          b: number;
          c: {
            d: string;
          };
        }
      >
    >;

    const schema2 = c.array(c.string().email()).max(4).nonEmpty();
    type InferredSchema2 = Infer<typeof schema2>;
    type typeTest2 = Expect<Equal<InferredSchema2, [string, ...string[]]>>;

    const schema3 = c.string().email().array().max(4).nonEmpty();
    type InferredSchema3 = Infer<typeof schema3>;
    type typeTest3 = Expect<Equal<InferredSchema3, [string, ...string[]]>>;
  });

  test("arrays", () => {
    expect(() => c.array(c.string().min(2)).parse(["ab", "ba"])).not.toThrow();
    expect(() => c.array(c.string()).parse([])).not.toThrow();
    expect(() => c.array(c.string()).parse([42])).toThrow();
    expect(() =>
      c.array(c.string()).nonEmpty().parse(["a", "b"])
    ).not.toThrow();
    expect(() => c.array(c.string()).nonEmpty().parse([])).toThrow();
    expect(() =>
      c
        .array(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "c", "d"])
    ).not.toThrow();
    expect(() =>
      c
        .array(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "d"])
    ).toThrow();

    const schema = c.array(c.string());
    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string[]>>;
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
        .parse(["a", "b", "c", "d"])
    ).not.toThrow();
    expect(() =>
      c
        .string()
        .array()
        .nonEmpty()
        .min(3)
        .max(5)
        .length(4)
        .parse(["a", "b", "d"])
    ).toThrow();

    const schema = c.string().array();
    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string[]>>;
  });

  test("sets", () => {
    expect(() =>
      c.set(c.string().min(2)).parse(new Set(["ab", "ba"]))
    ).not.toThrow();
    expect(() => c.set(c.string()).parse(new Set())).not.toThrow();
    expect(() => c.set(c.string()).parse(new Set([42]))).toThrow();
    expect(() =>
      c
        .set(c.string())
        .nonEmpty()
        .parse(new Set(["a", "b"]))
    ).not.toThrow();
    expect(() => c.set(c.string()).nonEmpty().parse(new Set([]))).toThrow();
    expect(() =>
      c
        .set(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .size(4)
        .parse(new Set(["a", "b", "c", "d"]))
    ).not.toThrow();
    expect(() =>
      c
        .set(c.string())
        .nonEmpty()
        .min(3)
        .max(5)
        .size(4)
        .parse(new Set(["a", "b", "d"]))
    ).toThrow();

    const schema = c.set(c.string());
    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, Set<string>>>;
  });

  test("nullable", () => {
    const schema = c.string().nullable();
    expect(() => schema.parse("hello")).not.toThrow();
    expect(() => schema.parse(null)).not.toThrow();
    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string | null>>;
  });

  test("nullable alt syntax", () => {
    const schema = c.nullable(c.string());
    expect(() => schema.parse("hello")).not.toThrow();
    expect(() => schema.parse(null)).not.toThrow();
    expect(() => schema.parse(undefined)).toThrow();
    expect(() => schema.parse(42)).toThrow();

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string | null>>;
  });

  test("optional", () => {
    const schema = c.string().optional();
    expect(() => schema.parse("hello")).not.toThrow();
    expect(() => schema.parse(undefined)).not.toThrow();
    expect(() => schema.parse(null)).toThrow();
    expect(() => schema.parse(42)).toThrow();
    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string | undefined>>;
  });

  test("optional alt syntax", () => {
    const schema = c.optional(c.string());
    expect(() => schema.parse("hello")).not.toThrow();
    expect(() => schema.parse(undefined)).not.toThrow();
    expect(() => schema.parse(null)).toThrow();
    expect(() => schema.parse(42)).toThrow();

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string | undefined>>;
  });

  test("optional fields", () => {
    const schema = c.object({
      a: c.string(),
      b: c.string().optional(),
    });

    type SchemaType = Infer<typeof schema>;
    type test = Expect<
      Equal<
        SchemaType,
        {
          a: string;
          b?: string | undefined;
        }
      >
    >;
  });

  test("literal", () => {
    const schema = c.literal("howdy");
    expect(() => schema.parse("howdy")).not.toThrow();
    expect(() => schema.parse("anything else")).toThrow();

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, "howdy">>;

    const schema2 = c.literal(42);
    expect(() => schema2.parse(42)).not.toThrow();
    expect(() => schema2.parse("anything else")).toThrow();

    type SchemaType2 = Infer<typeof schema2>;
    type test2 = Expect<Equal<SchemaType2, 42>>;
  });

  test("coerce", () => {
    const schema = c.coerce.string();
    expect(() => schema.parse("howdy")).not.toThrow();
    expect(() => schema.parse(42)).not.toThrow();

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, string>>;

    // TODO: test other coerce functions
  });
});
