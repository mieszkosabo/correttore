export const string = () => ({
  name: "string" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as string,
  parse: (arg: unknown) => {
    if (typeof arg !== "string") throw new Error(`${arg} is not a string.`);
    return arg;
  },
});

export const number = () => ({
  name: "number" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as number,
  parse: (arg: unknown) => {
    if (typeof arg !== "number") throw new Error(`${arg} is not a number.`);
    return arg;
  },
});

export const bigint = () => ({
  name: "bigint" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as bigint,
  parse: (arg: unknown) => {
    if (typeof arg !== "bigint") throw new Error(`${arg} is not a bigint.`);
    return arg;
  },
});

export const boolean = () => ({
  name: "boolean" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as boolean,
  parse: (arg: unknown) => {
    if (typeof arg !== "boolean") throw new Error(`${arg} is not a boolean.`);
    return arg;
  },
});

export const date = () => ({
  name: "date" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as Date,
  parse: (arg: unknown) => {
    if (!(arg instanceof Date)) throw new Error(`${arg} is not a Date.`);
    return arg;
  },
});

export const symbol = () => ({
  name: "symbol" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as symbol,
  parse: (arg: unknown) => {
    if (typeof arg !== "symbol") throw new Error(`${arg} is not a symbol.`);
    return arg;
  },
});

export const undefinedType = () => ({
  name: "undefined" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as undefined,
  parse: (arg: unknown) => {
    if (arg !== undefined) throw new Error(`${arg} is not undefined.`);
    return arg;
  },
});

export const nullType = () => ({
  name: "null" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as null,
  parse: (arg: unknown) => {
    if (arg !== null) throw new Error(`${arg} is not null.`);
    return arg;
  },
});

export const voidType = () => ({
  name: "void" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as void,
  parse: (arg: unknown) => {
    if (arg !== undefined) throw new Error(`${arg} is not void.`);
    return arg;
  },
});

export const anyType = () => ({
  name: "any" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as any,
  parse: (arg: unknown) => arg,
});

export const unknownType = () => ({
  name: "unknown" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as unknown,
  parse: (arg: unknown) => arg,
});

export const neverType = () => ({
  name: "never" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as never,
  parse: (arg: unknown) => {
    throw new Error(
      `Value of type ${typeof arg} cannot be assigned to type 'never'.`
    );
  },
});

export const nanType = () => ({
  name: "nan" as const,
  $inputType: null as unknown,
  $outputType: null as unknown as number,
  parse: (arg: unknown) => {
    const parsedValue = parseFloat(arg as string);
    if (!isNaN(parsedValue)) throw new Error(`${arg} is not a nan.`);
    return parsedValue;
  },
});
