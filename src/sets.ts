import { Fn } from "hotscript";
import { Identity, Validator } from "./shared.types";

interface SetType extends Fn {
  return: Set<this["arg1"]["$outputType"]>;
}

export const set = <const Schema extends Validator<any, any>>(
  chain: Schema,
) => ({
  name: "set" as const,
  $inputType: "root" as unknown as any,
  $outputType: "set" as unknown as SetType,
  parse: (arg: unknown) => {
    if (typeof arg !== "object" || arg === null || !(arg instanceof Set))
      throw new Error(`${arg} is not a set.`);
    arg.forEach((el) => {
      if (chain !== null) {
        chain.parse(el);
      } else {
        throw new Error(
          `No inner validator for set. Make sure to do c.set(c.someValidator())`,
        );
      }
    });
    return arg;
  },
});

export const nonEmpty = () => ({
  name: "nonEmpty" as const,
  $inputType: "set" as unknown as Set<any>,
  $outputType: "set" as unknown as Identity,
  parse: (arg: Set<any>) => {
    if (arg.size === 0) throw new Error(`set is empty.`);
    return arg;
  },
});

export const min = (min: number) => ({
  name: "min" as const,
  $inputType: "set" as unknown as Set<any>,
  $outputType: "set" as unknown as Identity,
  parse: (arg: Set<any>) => {
    if (arg.size < min) throw new Error(`Set is smaller than ${min}.`);
    return arg;
  },
});

export const max = (max: number) => ({
  name: "max" as const,
  $inputType: "set" as unknown as Set<any>,
  $outputType: "set" as unknown as Identity,
  parse: (arg: Set<any>) => {
    if (arg.size > max) throw new Error(`Set is greater than ${max}.`);
    return arg;
  },
});

export const size = (sizeParam: number) => ({
  name: "size" as const,
  $inputType: "set" as unknown as Set<any>,
  $outputType: "set" as unknown as Identity,
  parse: (arg: Set<any>) => {
    if (arg.size !== sizeParam)
      throw new Error(`Set is not of size ${sizeParam}.`);
    return arg;
  },
});
