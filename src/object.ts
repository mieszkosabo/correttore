import { Fn } from "hotscript";
import { Validator } from "./shared.types";

interface ObjectSchema extends Fn {
  return: {
    [K in keyof this["arg1"]]: this["arg1"][K]["$outputType"];
  };
}

export const object = <
  const Schema extends Record<string, Validator<any, any>>
>(
  schema: Schema
) => ({
  name: "object" as const,
  $inputType: "unknown" as unknown,
  $outputType: "object" as unknown as ObjectSchema,
  parse: (arg: unknown) => {
    if (typeof arg !== "object" || arg === null || Array.isArray(arg)) {
      throw new Error(`${arg} is not an object.`);
    }

    for (const k of Object.keys(schema)) {
      if (k in arg) {
        schema[k].parse((arg as any)[k]);
      } else {
        throw new Error(`Missing property ${k}`);
      }
    }

    return arg;
  },
});
