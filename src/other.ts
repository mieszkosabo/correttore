import { Fn } from "hotscript";
import { Validator } from "./shared.types";

interface Nullable extends Fn {
  return: this["args"] extends [...any, infer last]
    ? last extends { $outputType: infer OT }
      ? OT | null
      : last | null
    : never;
}

export const nullable = (innerValidator?: Validator<any, any>) => {
  const ctx = {
    chain: innerValidator ?? null,
  } satisfies { chain: Validator<any, any> | null };

  return {
    name: "nullable" as const,
    $inputType: "any" as unknown as any,
    $outputType: "any" as unknown as Nullable,
    processChain: (chain: Validator<any, any> | null) => {
      if (chain !== null) {
        ctx.chain = chain;
      }
      return [];
    },
    parse: (arg: any) => {
      if (arg === null) return arg;
      const chain = ctx.chain;
      if (chain !== null) {
        chain.parse(arg);
      } else {
        throw new Error(
          `No inner validator for array. Make sure to either call .array() after some validator or do c.array(c.someValidator())`
        );
      }

      return arg;
    },
  };
};

interface Optional extends Fn {
  return: this["args"] extends [...any, infer last]
    ? last extends { $outputType: infer OT }
      ? OT | undefined
      : last | undefined
    : never;
}

export const optional = (innerValidator?: Validator<any, any>) => {
  const ctx = {
    chain: innerValidator ?? null,
  } satisfies { chain: Validator<any, any> | null };

  return {
    name: "optional" as const,
    $inputType: "any" as unknown as any,
    $outputType: "any" as unknown as Optional,
    processChain: (chain: Validator<any, any> | null) => {
      if (chain !== null) {
        ctx.chain = chain;
      }
      return [];
    },
    parse: (arg: any) => {
      if (arg === undefined) return arg;
      const chain = ctx.chain;
      if (chain !== null) {
        chain.parse(arg);
      } else {
        throw new Error(
          `No inner validator for array. Make sure to either call .array() after some validator or do c.array(c.someValidator())`
        );
      }

      return arg;
    },
  };
};
