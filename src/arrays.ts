import { Fn } from "hotscript";
import { Identity, Validator } from "./shared.types";

interface ArrayType extends Fn {
  return: this["args"] extends [...any, infer last]
    ? last extends { $outputType: infer OT }
      ? Array<OT>
      : Array<last>
    : never;
}

export const array = (innerValidator?: Validator<any, any>) => {
  const ctx = {
    chain: innerValidator ? [innerValidator] : null,
  } satisfies { chain: Validator<any, any>[] | null };
  return {
    name: "array" as const,
    $inputType: "any" as unknown as any,
    $outputType: ((el: string) => {
      const elemType = innerValidator?.$outputType ?? el;
      return `array<${elemType}>`;
    }) as unknown as ArrayType,
    processChain: (chain: Validator<any, any>[] | null) => {
      if (chain !== null) {
        ctx.chain = chain;
      }
      return [];
    },
    parse: (arg: unknown) => {
      if (!Array.isArray(arg)) throw new Error(`${arg} is not an array.`);
      arg.forEach((el) => {
        const chain = ctx.chain;
        if (chain !== null) {
          chain.at(-1)!.parse(el);
        } else {
          throw new Error(
            `No inner validator for array. Make sure to either call .array() after some validator or do c.array(c.someValidator())`,
          );
        }
      });
      return arg;
    },
  };
};

interface NonEmpty extends Fn {
  return: this["arg0"] extends Array<infer T> ? [T, ...T[]] : never;
}

export const nonEmpty = () => ({
  name: "nonEmpty" as const,
  $inputType: "array<any>" as unknown as Array<any>,
  $outputType: ((prev: string) => prev) as unknown as NonEmpty,
  parse: (arg: Array<any>) => {
    if (arg.length === 0) throw new Error(`Array is empty.`);
    return arg;
  },
});

interface Element extends Fn {
  return: this["arg0"] extends Array<infer T> ? T : never;
}

export const element = () => {
  const ctx = {
    arrayValidator: null as Validator<any, any> | null,
  } satisfies { arrayValidator: Validator<any, any> | null };

  return {
    nonCallable: true as const,
    name: "element" as const,
    $inputType: "array<any>" as unknown as [any, ...any[]],
    processChain: (chain: Validator<any, any>[] | null) => {
      if (chain !== null) {
        // trim any methods that could come after the array, like nonEmpty, min, max, etc.
        const copy = chain.slice();
        let elem = copy.pop();
        while (elem?.name !== "array") {
          elem = copy.pop();
        }

        ctx.arrayValidator = elem;
      }
      return [];
    },
    $outputType: ((prev: string) => {
      return prev.slice("array<".length, -1);
    }) as unknown as Element,
    parse: (arg: unknown) => {
      if (ctx.arrayValidator === null) {
        throw new Error("element must be used after an array schema");
      }
      ctx.arrayValidator.parse([arg]);
      return arg;
    },
  };
};

export const min = (min: number) => ({
  name: "min" as const,
  $inputType: "array<any>" as unknown as [any, ...any[]],
  $outputType: ((prev: string) => prev) as unknown as Identity,
  parse: (arg: Array<any>) => {
    if (arg.length < min) throw new Error(`Array is smaller than ${min}.`);
    return arg;
  },
});

export const max = (max: number) => ({
  name: "max" as const,
  $inputType: "array<any>" as unknown as [any, ...any[]],
  $outputType: ((prev: string) => prev) as unknown as Identity,
  parse: (arg: Array<any>) => {
    if (arg.length > max) throw new Error(`Array is greater than ${max}.`);
    return arg;
  },
});

export const length = (length: number) => ({
  name: "length" as const,
  $inputType: "array<any>" as unknown as [any, ...any[]],
  $outputType: ((prev: string) => prev) as unknown as Identity,
  parse: (arg: Array<any>) => {
    if (arg.length !== length)
      throw new Error(`Array is not of length ${length}.`);
    return arg;
  },
});
