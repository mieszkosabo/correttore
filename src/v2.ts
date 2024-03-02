import { gte, lte } from "./numbers";
import { number, string } from "./primitives";
import { email, max, min } from "./strings";
import { PickByValue } from "./util-types";

type Validator<Input, Output> = {
  name: string;
  $inputType: Input;
  $outputType: Output;
  parse: (arg: Input) => Output;
};

const object = <const Schema extends Record<string, Validator<any, any>>>(
  schema: Schema
) => ({
  name: "object" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as {
    [K in keyof Schema]: Schema[K]["$outputType"];
  },
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

    return arg as {
      [K in keyof Schema]: Schema[K]["$outputType"];
    };
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
    ? (...params: Parameters<Validators[K]>) => Omit<
        ReturnType<Validators[K]>,
        "parse"
      > &
        GetChainableValidators<
          ReturnType<Validators[K]>["$outputType"],
          Validators,
          usedFeatures | K
        > & {
          // we annotate `parse` function to accept args that make sense, for example `minLength` will
          // except the arg to be string, not unknown, because we know it can only be used
          // in a parsers chain after `string()`.
          // however we need to substitute that arg with `unknown` for the library consumer,
          // because in their context they should be able to start the chain with any type.
          parse: (arg: unknown) => ReturnType<Validators[K]>["$outputType"];
        }
    : never;
};

type AnyFunReturning<T> = (...args: any) => T;

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

const c = initCorrettore([object, string, number, email, gte, lte, max, min]);

// TODO: hardcode `object` or sth
const aa = object({
  name: c.string().min(3).max(5),
  age: c.number().gte(10).lte(20),
  email: c.string().email(),
});

type xx = Infer<typeof aa>;

aa.parse({
  name: "abc",
  age: 15,
  email: "hello@example.com",
});
