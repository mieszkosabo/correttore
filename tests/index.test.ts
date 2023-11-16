import { describe, expect, test } from "bun:test";
import {
  initCorrettore,
  string,
  minLength,
  number,
  email,
  Infer,
} from "../src";
import { Equal, Expect } from "./helpers.types";

describe("basic tests", () => {
  const c = initCorrettore({
    string,
    minLength,
    number,
    email,
  });

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
  const aa = c
    .object({
      a: c.string(),
      b: c.number(),
    })
    .parse({
      a: "hello",
      b: 42,
    });

  test("all conditions in a chain are checked", () => {
    const schema = c.string().email().minLength(5);
    expect(() => schema.parse("aaa@a.pl")).not.toThrow();
    expect(() => schema.parse("aaapl.com")).toThrow();
    expect(() => schema.parse("a@e")).toThrow();
    expect(() => schema.parse(42)).toThrow();
  });

  test("types", () => {
    const schema = c.object({
      a: c.string().email().minLength(2),
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
  });
});
