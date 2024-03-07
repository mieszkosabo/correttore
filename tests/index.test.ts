import { describe, expect, test } from "bun:test";
import {
  initCorrettore,
  string,
  min,
  number,
  email,
  Infer,
  object,
} from "../src";
import { Equal, Expect } from "./helpers.types";
import {
  array,
  nonEmpty,
  min as arrayMin,
  max as arrayMax,
  length,
} from "../src/arrays";

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
          readonly a: string;
          readonly b: number;
          readonly c: {
            readonly d: string;
          };
        }
      >
    >;
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
  });

  test("array element", () => {
    const arrSchema = c.array(c.string().min(2));
    const el = arrSchema.element;
  });
});
