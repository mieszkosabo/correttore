import { describe, expect, test } from "bun:test";
import {
  initCorrettore,
  string,
  number,
  Infer,
  object,
  passthrough,
} from "../src";
import { Equal, Expect } from "./helpers.types";

describe("objects", () => {
  const c = initCorrettore([
    object,
    string,
    number,
    passthrough,
  ]);

  test("by default, object schemas strip out unrecognized keys during parsing", () => {
    const schema = c.object({
      x: c.number(),
      y: c.number(),
    });
    expect(schema.parse({x: 1, y: 2})).toEqual({x: 1, y: 2});
    expect(schema.parse({x: 1, y: 2, z: 3})).toEqual({x: 1, y: 2});
    expect(() => schema.parse({x: "a", y: 2})).toThrow()

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, { x: number, y: number }>>;
  });

  test("pass through unknown keys", () => {
    const schema = c.object({
      x: c.number(),
      y: c.number(),
    }).passthrough();
    expect(schema.parse({x: 1, y: 2})).toEqual({x: 1, y: 2});
    expect(schema.parse({x: 1, y: 2, z: 3})).toEqual({x: 1, y: 2, z: 3});
    expect(() => schema.parse({x: "a", y: 2})).toThrow()

    type SchemaType = Infer<typeof schema>;
    type test = Expect<Equal<SchemaType, { x: number, y: number }>>;
  });
});
