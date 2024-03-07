import type { Apply, Call, Fn } from "hotscript";
import { AnyFunReturning, Validator } from "./v2";
import { PickByValue } from "./util-types";

const hello = <T>(a: T) => ({
  name: "hello" as const,
  $inputType: null as unknown as unknown,
  $outputType: null as unknown as SomeFn,
  parse: (arg: unknown) => arg as T,
});

const goodbye = <T extends string>(a: T) => ({
  name: "goodbye" as const,
  $inputType: null as unknown as unknown,
  $outputType: null as unknown as OtherFun,
  parse: (arg: unknown) => arg as T,
});

type DoSomethingWithTypes<
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
      ) => Omit<ReturnType<Validators[K]>, "parse"> &
        DoSomethingWithTypes<
          Apply<ReturnType<Validators[K]>["$outputType"], Ps>,
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
          ) => Apply<ReturnType<Validators[K]>["$outputType"], Ps>;
        }
    : never;
};

type R1 = ReturnType<typeof hello>;

interface SomeFn extends Fn {
  return: [this["arg0"], this["arg0"]];
}

interface OtherFun extends Fn {
  return: `what's up ${this["arg0"]}`;
}

const createA = <const T extends AnyFunReturning<Validator<any, any>>[]>(
  args: T
) => {
  return null as unknown as DoSomethingWithTypes<unknown, T>;
};

let a = createA([hello, goodbye]);

const x = a.goodbye("yo").parse("howdy");

type xxx = string extends Fn ? true : false;
