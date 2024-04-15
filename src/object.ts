import { Fn } from "hotscript";
import { Validator } from "./shared.types";

interface ObjectSchema extends Fn {
  return: MakeFieldsWithUndefinedOptional<{
    [K in keyof this["arg1"]]: this["arg1"][K]["$outputType"];
  }>;
}

export const object = <
  const Schema extends Record<string, Validator<any, any>>
>(
  schema: Schema
) => ({
  name: "object" as const,
  $inputType: "root" as unknown,
  $outputType: "object" as unknown as ObjectSchema,
  parse: (arg: unknown) => {
    if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
      throw new Error(`${arg} is not an object.`);
    }

    const result: Record<string, any> = {}
    for (const k of Object.keys(schema)) {
      if (k in arg) {
        result[k] = schema[k].parse((arg as any)[k]);
      } else {
        throw new Error(`Missing property ${k}`);
      }
    }

    return result;
  },
});

type FieldsWithUndefined<T> = Exclude<
  keyof T,
  {
    [K in keyof T]: T[K] extends Exclude<T[K], undefined> ? K : never;
  }[keyof T]
>;

type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

type MakeFieldsWithUndefinedOptional<T> = Expand<
  {
    [K in Exclude<keyof T, FieldsWithUndefined<T>>]: T[K];
  } & { [K in FieldsWithUndefined<T>]?: T[K] }
>;

interface Identity extends Fn {
  return: this["arg0"];
}

export const passthrough = () => {
  const ctx = {
    chain: null as Validator<any, any> | null,
  } satisfies { chain: Validator<any, any> | null };

  return {
    name: "passthrough" as const,
    $inputType: "object" as unknown as any,
    $outputType: "object" as unknown as Identity,
    processChain: (chain: Validator<any, any> | null) => {
      if (chain !== null) {
        ctx.chain = chain;
      }
      return [];
    },
    parse: (arg: Record<string, any>) => {
      if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
        throw new Error(`${arg} is not an object.`);
      }
      if (ctx.chain === null) {
        throw new Error("passthrough must be used after an object schema");
      }
      ctx.chain.parse(arg);

      const result = {}
      Object.assign(result, arg);
      return result;
    },
  };
};

export const strict = () => {
  const ctx = {
    chain: null as Validator<any, any> | null,
  } satisfies { chain: Validator<any, any> | null };

  return {
    name: "strict" as const,
    $inputType: "object" as unknown as any,
    $outputType: "object" as unknown as Identity,
    processChain: (chain: Validator<any, any> | null) => {
      if (chain !== null) {
        ctx.chain = chain;
      }
      return [];
    },
    parse: (arg: Record<string, any>) => {
      if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
        throw new Error(`${arg} is not an object.`);
      }
      if (ctx.chain === null) {
        throw new Error("strict must be used after an object schema");
      }

      const parsed = ctx.chain.parse(arg);
      const recognizedKeys = Object.keys(parsed);
      const unrecognizedKeys = Object.keys(arg).filter((k) => !recognizedKeys.includes(k));
      if (unrecognizedKeys.length > 0) {
        throw new Error(`Unrecognized keys: ${unrecognizedKeys.map(k => `'${k}'`).join(", ")}`);
      }
      return parsed;
    },
  };
};
