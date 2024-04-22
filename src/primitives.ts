export const string = () => ({
  name: "string" as const,
  $inputType: "root" as const,
  $outputType: "string" as unknown as string,
  parse: (arg: unknown) => {
    if (typeof arg !== "string") throw new Error(`${arg} is not a string.`);
    return arg;
  },
});

export const number = () => ({
  name: "number" as const,
  $inputType: "root" as const,
  $outputType: "number" as unknown as number,
  parse: (arg: unknown) => {
    if (typeof arg !== "number") throw new Error(`${arg} is not a number.`);
    return arg;
  },
});

export const bigint = () => ({
  name: "bigint" as const,
  $inputType: "root" as const,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: unknown) => {
    if (typeof arg !== "bigint") throw new Error(`${arg} is not a bigint.`);
    return arg;
  },
});

export const boolean = () => ({
  name: "boolean" as const,
  $inputType: "root" as const,
  $outputType: "boolean" as unknown as boolean,
  parse: (arg: unknown) => {
    if (typeof arg !== "boolean") throw new Error(`${arg} is not a boolean.`);
    return arg;
  },
});

export const date = () => ({
  name: "date" as const,
  $inputType: "root" as const,
  $outputType: "Date" as unknown as Date,
  parse: (arg: unknown) => {
    if (!(arg instanceof Date)) {
      throw new Error(`${arg} is not a Date.`);
    }
    if (arg instanceof Date && isNaN(arg.getTime())) {
      throw new Error(`${arg} is an invalid Date.`);
    }

    return arg;
  },
});

export const symbol = () => ({
  name: "symbol" as const,
  $inputType: "root" as const,
  $outputType: "symbol" as unknown as symbol,
  parse: (arg: unknown) => {
    if (typeof arg !== "symbol") throw new Error(`${arg} is not a symbol.`);
    return arg;
  },
});

export const undefinedType = () => ({
  name: "undefined" as const,
  $inputType: "root" as const,
  $outputType: "undefined" as unknown as undefined,
  parse: (arg: unknown) => {
    if (arg !== undefined) throw new Error(`${arg} is not undefined.`);
    return arg;
  },
});

export const nullType = () => ({
  name: "null" as const,
  $inputType: "root" as const,
  $outputType: "null" as unknown as null,
  parse: (arg: unknown) => {
    if (arg !== null) throw new Error(`${arg} is not null.`);
    return arg;
  },
});

export const voidType = () => ({
  name: "void" as const,
  $inputType: "root" as const,
  $outputType: "void" as unknown as void,
  parse: (arg: unknown) => {
    if (arg !== undefined) throw new Error(`${arg} is not void.`);
    return arg;
  },
});

export const anyType = () => ({
  name: "any" as const,
  $inputType: "root" as const,
  $outputType: "any" as unknown as any,
  parse: (arg: unknown) => arg,
});

export const unknownType = () => ({
  name: "root" as const,
  $inputType: "root" as const,
  $outputType: "root" as const as unknown,
  parse: (arg: unknown) => arg,
});

export const neverType = () => ({
  name: "never" as const,
  $inputType: "root" as const,
  $outputType: "never" as unknown as never,
  parse: (arg: unknown) => {
    throw new Error(
      `Value of type ${typeof arg} cannot be assigned to type 'never'.`,
    );
  },
});

export const nanType = () => ({
  name: "nan" as const,
  $inputType: "root" as const,
  $outputType: "number" as unknown as number,
  parse: (arg: unknown) => {
    const parsedValue = parseFloat(arg as string);
    if (!isNaN(parsedValue)) throw new Error(`${arg} is not a nan.`);
    return parsedValue;
  },
});
