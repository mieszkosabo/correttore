import { NumberParser, ObjectParser, StringParser } from "./parsers";
import { Parser } from "./utils";

const createParserProxy = (
  parsers: Record<string, (...args: any) => Parser<any>>,
  parsersChain: Parser<any>[]
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
              .forEach((p) => p.parse(arg));

            // return the result of the last one
            return parsersChain[parsersChain.length - 1].parse(arg);
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
  Parsers extends Record<string, (...args: any) => Parser<any>>
>(
  parsers: Parsers
): calculateCorrettoreType<keyof Parsers> => {
  return new Proxy({} as calculateCorrettoreType<keyof Parsers>, {
    get(_target, key) {
      if (key in parsers) {
        return (args: any) =>
          createParserProxy(parsers, [parsers[key as any](args)]);
      } else {
        throw new Error(`Unknown parser ${key as string}`);
      }
    },
  });
};

// Full correttore type with all parsers and extensions
type FullCorrettore = {
  string: () => StringParser;
  number: () => NumberParser;
  object: <S extends Record<string, Parser<any>>>(schema: S) => ObjectParser<S>;
};

// given the list of imported parsers and validator, calculate a type for the correttore object
type calculateCorrettoreType<
  // e.g. "string" | "email" | "object" | "minLength"
  features,
  // e.g. string() => { email: ..., parse: ..., minLength: ..., ...}
  parser extends Record<string, (...args: any[]) => any> = FullCorrettore,
  // features already used in the current chain, e.g. for `c.string().email()`
  // this would be "string" | "email".
  // `never` corresponds to an empty union
  usedFeatures = never
> = {
  [k in Exclude<
    Extract<keyof parser, features | "parse">,
    usedFeatures
  >]: k extends "parse"
    ? parser[k]
    : (
        ...args: Parameters<parser[k]>
      ) => calculateCorrettoreType<
        features,
        ReturnType<parser[k]>,
        usedFeatures | k
      >;
};

// --------------

type Validator<type, validatorFn> = (arg: type) => validatorFn;

const stringParser: Validator<unknown, () => string> = (arg) => () => {
  if (typeof arg !== "string") throw new Error("Not a string!");
  return arg;
};

const numberParser: Validator<unknown, () => number> = (arg) => () => {
  if (typeof arg !== "number") throw new Error("Not a number!");
  return arg;
};

const objectParser =
  (arg: unknown) =>
  <T, Schema extends Record<string, { parse: (...args: any[]) => T }>>(
    schema: Schema
  ) => {
    // TODO: implement
    return arg;
  };

const xxx = objectParser({
  a: stringParser("aa"),
  b: numberParser(12),
});

const emailValidator: Validator<string, () => string> = (arg) => () => {
  if (!arg.includes("@")) throw new Error("Not an email!");
  return arg;
};

const minLengthValidator: Validator<string, (minLength: number) => string> =
  (arg) => (minLength) => {
    if (arg.length < minLength) throw new Error("Too short!");
    return arg;
  };

const min: Validator<number, (min: number) => number> = (arg) => (min) => {
  if (arg < min) throw new Error("Too small!");
  return arg;
};

type calculateTopLevelCorrettoreType<
  validators extends Record<string, Validator<any, any>>
> = {
  [k in keyof PickByValue<validators, Validator<unknown, any>>]: <
    Params extends Parameters<ReturnType<validators[k]>>
  >(
    ...params: Params
  ) => calculateNestedCorrettoreType<
    ReturnType<ReturnType<validators[k]>>,
    PickByValue<
      validators,
      Validator<ReturnType<ReturnType<validators[k]>>, any>
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
        ...params: Parameters<ReturnType<validators[k]>>
      ) => calculateNestedCorrettoreType<
        ReturnType<ReturnType<validators[k]>>,
        PickByValue<
          validators,
          Validator<ReturnType<ReturnType<validators[k]>>, any>
        >,
        usedFeatures | k
      >
    : never;
};

let test: calculateTopLevelCorrettoreType<{
  object: typeof objectParser;
  string: typeof stringParser;
  number: typeof numberParser;
  email: typeof emailValidator;
  minLength: typeof minLengthValidator;
  min: typeof min;
}>;

type x = ReturnType<typeof test.string>;

const a = test.string().email().minLength(1).parse("aa");

const b = test.object({
  a: test.string().email().minLength(1),
  b: test.number().min(1),
});

// type valids = {
//   email: typeof emailValidator;
//   minLength: typeof minLengthValidator;
//   min: typeof min;
// };

// type aaa = PickByValue<valids, Validator<ReturnType<valids[""]>, any>>

const aa = {
  a: 1,
  b: () => 42,
  c: 3,
} as const;

type AA = ValueOf<typeof aa>;

// test.number().

type Entries<Obj> = ValueOf<{
  [Key in keyof Obj]: [Key, Obj[Key]];
}>;

type ValueOf<T> = T[keyof T];

type FromEntries<Entries extends [any, any]> = {
  [Val in Entries as Val[0]]: Val[1];
};

type PickByValue<Obj, Condition> = FromEntries<
  Extract<Entries<Obj>, [any, Condition]>
>;

type OmitByValue<T, Omitted> = FromEntries<Exclude<Entries<T>, [any, Omitted]>>;

type Identity<T> = T;
type somegen = <T>(x: T) => T;

type Zzz = ReturnType<somegen>;

const ss: somegen = (x: string) => x;
