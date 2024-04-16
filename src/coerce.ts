declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

type Coerce = Branded<"coerce", "coerce">;

export const coerce = () => ({
  nonCallable: true as const,
  name: "coerce" as const,
  $inputType: "root" as const,
  $outputType: "coerce" as unknown as Coerce,
  parse: () => {},
});

export const stringCoerce = () => ({
  name: "string" as const,
  $inputType: "coerce" as unknown as Coerce,
  $outputType: "string" as unknown as string,
  parse: (arg: unknown) => {
    return String(arg);
  },
});

export const numberCoerce = () => ({
  name: "number" as const,
  $inputType: "coerce" as unknown as Coerce,
  $outputType: "number" as unknown as number,
  parse: (arg: unknown) => {
    return Number(arg);
  },
});

// do the same for boolean, bigint and date

export const booleanCoerce = () => ({
  name: "boolean" as const,
  $inputType: "coerce" as unknown as Coerce,
  $outputType: "boolean" as unknown as boolean,
  parse: (arg: unknown) => {
    return Boolean(arg);
  },
});

export const bigintCoerce = () => ({
  name: "bigint" as const,
  $inputType: "coerce" as unknown as Coerce,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: any) => {
    return BigInt(arg);
  },
});

export const dateCoerce = () => ({
  name: "date" as const,
  $inputType: "coerce" as unknown as Coerce,
  $outputType: "date" as unknown as Date,
  parse: (arg: any) => {
    return new Date(arg);
  },
});
