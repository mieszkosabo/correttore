import { describe, expect, test } from "vitest";
import {
  initCorrettore,
  string,
  number,
  Infer,
  object,
  passthrough,
  strict,
} from "../src";
import { Equal, Expect } from "./helpers.types";

describe("objects", () => {
  const c = initCorrettore([object, string, number, passthrough, strict]);

  test("by default, object schemas strip out unrecognized keys during parsing", () => {
    const schema = c.object({
      x: c.number(),
      y: c.number(),
    });
    expect(schema.parse({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(schema.parse({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2 });
    expect(() => schema.parse({ x: "a", y: 2 })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, { x: number; y: number }>>;
  });

  test("pass through unknown keys", () => {
    const schema = c
      .object({
        x: c.number(),
        y: c.number(),
      })
      .passthrough();
    expect(schema.parse({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(schema.parse({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
    expect(() => schema.parse({ x: "a", y: 2 })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, { x: number; y: number }>>;
  });

  test("throw if unknown keys in the input", () => {
    const schema = c
      .object({
        x: c.number(),
      })
      .strict();
    expect(schema.parse({ x: 1 })).toEqual({ x: 1 });
    expect(() => schema.parse({ x: 1, y: 2 })).toThrow();
    expect(() => schema.parse({ x: "a" })).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, { x: number }>>;
  });
});
