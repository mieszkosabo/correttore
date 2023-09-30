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

            // return the result of the n-th one (last one)
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
