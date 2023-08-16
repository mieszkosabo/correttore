import { Parser } from "../utils";

export type ObjectParser<S extends Record<string, Parser<any>>> = {
  parse: (arg: unknown) => {
    [K in keyof S]: ReturnType<S[K]["parse"]>;
  };
};

export const object = <T, S extends Record<string, Parser<T>>>(schema: S) => {
  function validate(arg: unknown): asserts arg is {
    [K in keyof S]: ReturnType<S[K]["parse"]>;
  } {
    if (!arg) throw new Error("Not an object!");
    if (typeof arg !== "object") throw new Error("Not an object!");
    if (Array.isArray(arg)) throw new Error("Not an object!");

    for (const k of Object.keys(schema)) {
      if (k in arg) {
        schema[k].parse((arg as any)[k]);
      } else {
        throw new Error(`Missing property ${k}`);
      }
    }
  }

  return {
    parse(arg: unknown) {
      validate(arg);
      return arg;
    },
  };
};
