import { Apply, Fn } from "hotscript";
import { gte, lte } from "./numbers";
import { number, string } from "./primitives";
import { email, max, min } from "./strings";
import { PickByValue } from "./util-types";

export type Validator<Input, Output> = {
  name: string;
  $inputType: Input;
  $outputType: Output;
  parse: (arg: Input) => Output;
};

interface ObjectSchema extends Fn {
  return: {
    [K in keyof this["arg0"]]: this["arg0"][K]["$outputType"];
  };
}

const object = <const Schema extends Record<string, Validator<any, any>>>(
  schema: Schema
) => ({
  name: "object" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as ObjectSchema,
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

type Infer<Schema extends Validator<any, any>> = Schema["$outputType"];

type GetChainableValidators<
  OutputType,
  Validators extends AnyFunReturning<Validator<any, any>>[],
  usedFeatures = never
> = {
  [K in Exclude<
    keyof PickByValue<Validators, AnyFunReturning<Validator<OutputType, any>>>,
    usedFeatures
  > as K extends keyof Validators
    ? ReturnType<Validators[K]>["name"]
    : ""]: K extends keyof Validators
    ? <const Ps extends Parameters<Validators[K]>>(
        ...params: Ps
      ) => Omit<ReturnType<Validators[K]>, "parse" | "$outputType"> &
        GetChainableValidators<
          ReturnType<Validators[K]>["$outputType"] extends Fn
            ? Apply<ReturnType<Validators[K]>["$outputType"], Ps>
            : ReturnType<Validators[K]>["$outputType"],
          Validators,
          usedFeatures | K
        > & {
          // we annotate `parse` function to accept args that make sense, for example `minLength` will
          // except the arg to be string, not unknown, because we know it can only be used
          // in a parsers chain after `string()`.
          // however we need to substitute that arg with `unknown` for the library consumer,
          // because in their context they should be able to start the chain with any type.
          parse: (
            arg: unknown
          ) => ReturnType<Validators[K]>["$outputType"] extends Fn
            ? Apply<ReturnType<Validators[K]>["$outputType"], Ps>
            : ReturnType<Validators[K]>["$outputType"];
          $outputType: ReturnType<Validators[K]>["$outputType"] extends Fn
            ? Apply<ReturnType<Validators[K]>["$outputType"], Ps>
            : ReturnType<Validators[K]>["$outputType"];
        }
    : never;
};

export type AnyFunReturning<T> = (...args: any) => T;

const createParserProxy = (
  validators: AnyFunReturning<Validator<any, any>>[],
  validatorsChain: Validator<any, any>[]
) => {
  return new Proxy(
    {},
    {
      get(_target, key) {
        if (key === "parse") {
          return (arg: any) => {
            // check if `arg` passes first n - 1 constrains
            validatorsChain
              .slice(0, validatorsChain.length - 1)
              .forEach((p) => p.parse(arg));

            // return the result of the last one
            return validatorsChain[validatorsChain.length - 1].parse(arg);
          };
        }
        if (key in validators) {
          return (args: any) =>
            createParserProxy(validators, [
              ...validatorsChain,
              validators[key as any](args),
            ]);
        } else {
          throw new Error(`Unknown parser ${key as string}`);
        }
      },
    }
  );
};

export const initCorrettore = <
  const Validators extends AnyFunReturning<Validator<any, any>>[]
>(
  validators: Validators
): GetChainableValidators<unknown, Validators> => {
  return new Proxy({} as GetChainableValidators<unknown, Validators>, {
    get(_target, key) {
      if (key in validators) {
        return (args: any) => {
          return createParserProxy(validators, [
            validators.find(key as any)!(args),
          ]);
        };
      } else {
        throw new Error(`Unknown parser ${key as string}`);
      }
    },
  });
};

interface Yo extends Fn {
  return: `yo ${this["arg0"]}`;
}

const yo = <T>(hello: T) => ({
  name: "yo" as const,
  $inputType: null as unknown as unknown,
  $outputType: null as unknown as Yo,
  parse: (arg: T) => arg,
});

const c = initCorrettore([
  object,
  string,
  number,
  email,
  gte,
  lte,
  max,
  min,
  yo,
]);

const aa = c.object({
  name: c.string().min(3).max(5),
  age: c.number().gte(10).lte(20),
  email: c.string().email(),
});

type tta = Infer<typeof aa>;

const zxc = aa.parse({});

const bb = c.string().min(3).max(5).parse("hello");

const ccc = c.yo("man!");
const cc = c.yo("man!").parse("hello");

type tt = Infer<typeof ccc>;
