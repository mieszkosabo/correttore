type Merge<F, S> = {
  [k in keyof F | keyof S]: k extends keyof S
    ? S[k]
    : k extends keyof F
    ? F[k]
    : never;
};

export type ParserWithExtensions<
  T,
  extensions extends any[]
> = extensions extends [infer H, ...infer R]
  ? Merge<H, ParserWithExtensions<T, R>>
  : { parse: (arg: unknown) => T };

export type AssertFn<T> = (arg: unknown) => asserts arg is T;
export type ParseFn<T> = (arg: any) => T;
export type Parser<T> = {
  parse: ParseFn<T>;
};
