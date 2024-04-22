import { describe, expect, test } from "vitest";
import { Infer, date, dates, initCorrettore } from "../src";
import { Equal, Expect } from "./helpers.types";

describe("dates", () => {
  const c = initCorrettore([date, dates.max, dates.min]);

  test("date", () => {
    const schema = c.date();
    expect(() => schema.parse(new Date())).not.toThrow();
    expect(() => schema.parse("2022-01-12T00:00:00.000Z")).toThrow();
    expect(() => schema.parse(new Date("invalid"))).toThrow();

    type SchemaType = Infer<typeof schema>;
    type _test = Expect<Equal<SchemaType, Date>>;
  });

  test("min", () => {
    const schema = c.date().min(new Date("2022-01-01T00:00:00.000Z"));
    expect(() =>
      schema.parse(new Date("2022-01-02T00:00:00.000Z")),
    ).not.toThrow();
    expect(() => schema.parse(new Date("2021-12-31T00:00:00.000Z"))).toThrow();
  });

  test("max", () => {
    const schema = c.date().max(new Date("2022-01-01T00:00:00.000Z"));
    expect(() =>
      schema.parse(new Date("2021-12-31T00:00:00.000Z")),
    ).not.toThrow();
    expect(() => schema.parse(new Date("2022-01-02T00:00:00.000Z"))).toThrow();
  });
});
