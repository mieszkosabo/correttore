import {
  AnyFunction,
  OmitByValue,
  Parser,
  PickByValue,
  Validator,
  ValidatorFn,
} from "./util-types";

const object =
  <T, Schema extends Record<string, Parser<T>>>(schema: Schema) =>
  (arg: unknown) => {
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
  };

const createParserProxy = (
  parsers: Record<string, (...args: any) => ValidatorFn>,
  parsersChain: ValidatorFn[]
) =>
  new Proxy(
    {},
    {
      get(target, key) {
        if (key === "parse") {
          return (arg: any) => {
            // check if `arg` passes first n - 1 constrains
            parsersChain
              .slice(0, parsersChain.length - 1)
              .forEach((p) => p(arg));

            // return the result of the last one
            return parsersChain[parsersChain.length - 1](arg);
          };
        }
        if (key in parsers) {
          return (args: any) =>
            createParserProxy(parsers, [
              ...parsersChain,
              parsers[key as any](args),
            ]);
        } else {
          throw new Error(`Unknown parser ${key as string}`);
        }
      },
    }
  );

export const initCorrettore = <
  validators extends Record<string, Validator<any, any, any>>
>(
  parsers: validators
): calculateTopLevelCorrettoreType<validators> => {
  return new Proxy({} as calculateTopLevelCorrettoreType<validators>, {
    get(_target, key) {
      // `object` is always available
      if (key === "object") {
        return (schema: any) => createParserProxy(parsers, [object(schema)]);
      }

      if (key in parsers) {
        return (args: any) =>
          createParserProxy(parsers, [parsers[key as any](args)]);
      } else {
        throw new Error(`Unknown parser ${key as string}`);
      }
    },
  });
};

type calculateObjectType<Params extends any[]> = {
  parse: (arg: unknown) => {
    [schemaField in keyof Params[0]]: "parse" extends keyof Params[0][schemaField]
      ? Params[0][schemaField]["parse"] extends AnyFunction
        ? ReturnType<Params[0][schemaField]["parse"]>
        : never
      : never;
  };
};

type calculateTopLevelCorrettoreType<
  validators extends Record<string, Validator<any, any>>
> = {
  [k in keyof PickByValue<validators, Validator<unknown, any>> | "object"]: <
    Params extends any[]
  >(
    ...params: Params
  ) => k extends "object"
    ? calculateObjectType<Params>
    : calculateNestedCorrettoreType<
        ReturnType<ReturnType<validators[k]>>,
        PickByValue<
          validators,
          Validator<ReturnType<ReturnType<validators[k]>>, any, any>
        >
      >;
};

type calculateNestedCorrettoreType<
  CurrentParserType,
  validators extends Record<string, Validator<any, any>>,
  usedFeatures = never
> = {
  [k in
    | Exclude<
        keyof OmitByValue<validators, Validator<unknown, any>>,
        usedFeatures
      >
    | "parse"]: k extends "parse"
    ? (arg: unknown) => CurrentParserType
    : k extends keyof validators
    ? (
        ...params: Parameters<validators[k]>
      ) => calculateNestedCorrettoreType<
        ReturnType<ReturnType<validators[k]>>,
        PickByValue<
          validators,
          Validator<ReturnType<ReturnType<validators[k]>>, any, any>
        >,
        usedFeatures | k
      >
    : never;
};
