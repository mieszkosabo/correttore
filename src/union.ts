import { Fn } from "hotscript";
import { Validator } from "./shared.types";

interface OrSchema extends Fn {
  return: this["args"] extends [...any, infer prev, infer last]
    ? last extends { $outputType: infer T1 }
      ? prev extends { $outputType: infer T2 }
        ? T1 | T2
        : T1 | prev
      : prev extends { $outputType: infer T2 }
        ? last | T2
        : last | prev
    : never;
}

export const or = <T1, T2>(innerValidator: Validator<T1, any>) => {
  const ctx = {
    chain: null as Validator<T2, any> | null,
  } satisfies { chain: Validator<T2, any> | null };

  return {
    name: "or" as const,
    $inputType: "any" as unknown as T1 | T2,
    $outputType: "any" as unknown as OrSchema,
    processChain: (chain: Validator<T2, any>[] | null) => {
      if (chain !== null) {
        ctx.chain = chain.at(-1)!;
      }
      return [];
    },
    parse: (arg: any) => {
      const chain = ctx.chain;
      if (chain === null) {
        throw new Error(
          `No inner validator. Make sure to do c.someValidator().or(c.otherValidator())`,
        );
      }

      try {
        return chain.parse(arg);
      } catch (e) {
        return innerValidator.parse(arg);
      }
    },
  };
};

interface Union extends Fn {
  return: this["arg1"][number]["$outputType"];
}

export const union = <Options extends Validator<any, any>[]>(
  options: Options,
) => ({
  name: "union" as const,
  $inputType: "root" as const,
  $outputType: "any" as unknown as Union,
  parse: (arg: unknown) => {
    for (const option of options) {
      try {
        return option.parse(arg);
      } catch (e) {
        // continue
      }
    }

    throw new Error(`No validator matched for ${arg}`);
  },
});
