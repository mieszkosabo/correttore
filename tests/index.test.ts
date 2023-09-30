import { describe, expect, test } from "bun:test";
import {
  initCorrettore,
  object,
  string,
  minLength,
  number,
  email,
} from "../src";

describe("basic tests", () => {
  const c = initCorrettore({
    string,
    minLength,
    number,
    email,
    object,
  });

  test("all conditions in a chain are checked", () => {
    const schema = c.string().email().minLength(5);
    expect(() => schema.parse("aaa@a.pl")).not.toThrow();
    expect(() => schema.parse("aaapl.com")).toThrow();
    expect(() => schema.parse("a@e")).toThrow();
    expect(() => schema.parse(42)).toThrow();
  });

  test("short schema", () => {
    expect(() => c.string().parse(42)).toThrow();
    expect(() => c.string().parse("abc")).not.toThrow();
  });

  const schema = c.object({
    a: c.object({
      b: c.string().email().minLength(2),
      c: c.number(),
    }),
  });
});
