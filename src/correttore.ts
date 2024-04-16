import { Apply, Fn } from "hotscript";
import { AnyFunReturning, PickByValue } from "./util.types";
import { Validator } from "./shared.types";

// union type of features that are allowed to be chained multiple times
type multiChainableFeatures = "or";
type FindMultiChainableFeatures<
  Validators extends AnyFunReturning<Validator<any, any>>[],
> = keyof PickByValue<
  Validators,
  AnyFunReturning<{ name: multiChainableFeatures }>
>;

type GetChainableValidators<
  OutputType,
  Validators extends AnyFunReturning<Validator<any, any>>[],
  usedFeatures = never,
> = {
  [K in Exclude<
    keyof PickByValue<Validators, AnyFunReturning<Validator<OutputType, any>>>,
    // don't show the same feature in the same chain, e.g.
    // `c.string().string()` should not be allowed.
    // However we allows some features to be multi-chainable, e.g.
    // `or` in `c.or(c.string()).or(c.number())`
    Exclude<usedFeatures, FindMultiChainableFeatures<Validators>>
  > as K extends keyof Validators
    ? ReturnType<Validators[K]>["name"]
    : ""]: K extends keyof Validators
    ? ReturnType<Validators[K]>["nonCallable"] extends true
      ? Omit<ReturnType<Validators[K]>, "parse" | "$outputType"> &
          GetChainableValidators<
            ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<ReturnType<Validators[K]>["$outputType"], [OutputType]>
              : ReturnType<Validators[K]>["$outputType"],
            Validators,
            usedFeatures | K
          > & {
            parse: (
              arg: unknown,
            ) => ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<ReturnType<Validators[K]>["$outputType"], [OutputType]>
              : ReturnType<Validators[K]>["$outputType"];
            $outputType: ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<ReturnType<Validators[K]>["$outputType"], [OutputType]>
              : ReturnType<Validators[K]>["$outputType"];
          }
      : <const Ps extends Parameters<Validators[K]>>(
          ...params: Ps
        ) => Omit<ReturnType<Validators[K]>, "parse" | "$outputType"> &
          GetChainableValidators<
            ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<
                  ReturnType<Validators[K]>["$outputType"],
                  [OutputType, ...Ps]
                >
              : ReturnType<Validators[K]>["$outputType"],
            Validators,
            usedFeatures | K
          > & {
            // we annotate `parse` function to accept args that make sense, for example `min` will
            // except the arg to be string, not unknown, because we know it can only be used
            // in a parsers chain after `string()`.
            // however we need to substitute that arg with `unknown` for the library consumer,
            // because in their context they should be able to start the chain with any type.
            parse: (
              arg: unknown,
            ) => ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<
                  ReturnType<Validators[K]>["$outputType"],
                  [OutputType, ...Ps]
                >
              : ReturnType<Validators[K]>["$outputType"];
            // We also need to update the $outputType, so that if it's a type-level function, we call it
            // with the passed parameters, and if it's a type, we just return it.
            $outputType: ReturnType<Validators[K]>["$outputType"] extends Fn
              ? Apply<
                  ReturnType<Validators[K]>["$outputType"],
                  [OutputType, ...Ps]
                >
              : ReturnType<Validators[K]>["$outputType"];
          }
    : never;
};

const doesExtend = (A: string, B: string) => {
  if (A === B) {
    return true;
  }

  if (B === "any") {
    return true;
  }

  return false;
};

const callIfFun = (
  maybeFn: string | AnyFunReturning<string>,
  arg: any,
): string => {
  if (typeof maybeFn === "function") {
    return maybeFn(arg);
  } else {
    return maybeFn;
  }
};

const createParserProxy = (
  validators: AnyFunReturning<Validator<any, any>>[],
  validatorsChain: Validator<any, any>[],
  outputType: string,
): any => {
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
        const applicableValidators = validators.filter((v) =>
          doesExtend(outputType, v().$inputType),
        );
        const validatorIdx = applicableValidators.findIndex(
          (v) => v().name === key,
        );

        const isNonCallable = applicableValidators[validatorIdx]!().nonCallable;

        if (validatorIdx !== -1) {
          if (isNonCallable) {
            const validator = applicableValidators[validatorIdx]();
            const chain = validator.processChain
              ? validator.processChain(validatorsChain.at(-1) ?? null)
              : validatorsChain;

            return createParserProxy(
              validators,
              [...chain, validator],
              callIfFun(
                applicableValidators[validatorIdx]().$outputType,
                outputType,
              ),
            );
          } else {
            return (args: any) => {
              const validator = applicableValidators[validatorIdx](args);
              const chain = validator.processChain
                ? validator.processChain(validatorsChain.at(-1) ?? null)
                : validatorsChain;

              return createParserProxy(
                validators,
                [...chain, validator],
                callIfFun(
                  applicableValidators[validatorIdx](args).$outputType,
                  outputType,
                ),
              );
            };
          }
        } else {
          throw new Error(`Unknown parser ${key as string}`);
        }
      },
    },
  );
};

export const initCorrettore = <
  const Validators extends AnyFunReturning<Validator<any, any>>[],
>(
  validators: Validators,
): GetChainableValidators<unknown, Validators> => {
  return new Proxy({} as GetChainableValidators<unknown, Validators>, {
    get(_target, key) {
      // the base validators (ones that can be used from `c` variable) take "unknown" as their input
      const applicableValidators = validators.filter((v) =>
        doesExtend("root", v().$inputType),
      );
      const validatorIdx = applicableValidators.findIndex(
        (v) => v().name === key,
      );

      const isNonCallable = applicableValidators[validatorIdx]!().nonCallable;

      if (validatorIdx !== -1) {
        if (isNonCallable) {
          return createParserProxy(
            validators,
            [applicableValidators[validatorIdx]!()],
            applicableValidators[validatorIdx]!().$outputType,
          );
        } else {
          return (args: any) => {
            return createParserProxy(
              validators,
              [applicableValidators[validatorIdx]!(args)],
              applicableValidators[validatorIdx]!().$outputType,
            );
          };
        }
      } else {
        throw new Error(`Unknown parser ${key as string}`);
      }
    },
  });
};
