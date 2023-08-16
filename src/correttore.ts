import { NumberParser, ObjectParser, StringParser } from "./parsers";
import { Parser } from "./utils";

const createParserProxy = (
  p: Parser<any>,
  parsers: Record<string, (...args: any) => Parser<any>>,
  parsersChain: Parser<any>[]
) =>
  new Proxy(p, {
    get(target, key) {
      if (key === "parse") {
        return (arg: any) => {
          parsersChain.forEach((p) => p.parse(arg));
          return target.parse(arg);
        };
      }
      if (key in parsers) {
        return (args: any) =>
          createParserProxy(parsers[key as any](args), parsers, [
            ...parsersChain,
            parsers[key as any](args),
          ]);
      } else {
        throw new Error(`Unknown parser ${key as string}`);
      }
    },
  });

export const initCorrettore = <
  Parsers extends Record<string, (...args: any) => Parser<any>>
>(
  parsers: Parsers
): calculateCorrettoreType<keyof Parsers> => {
  return new Proxy({} as calculateCorrettoreType<keyof Parsers>, {
    get(target, key) {
      if (key in parsers) {
        return (args: any) =>
          createParserProxy(parsers[key as any](args), parsers, [
            parsers[key as any](args),
          ]);
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
  features,
  parser extends Record<string, (...args: any[]) => any> = FullCorrettore
> = {
  [k in Extract<keyof parser, features | "parse">]: k extends "parse"
    ? parser[k]
    : (
        ...args: Parameters<parser[k]>
      ) => calculateCorrettoreType<features, ReturnType<parser[k]>>;
};
