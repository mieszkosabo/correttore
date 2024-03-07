export const gt = (min: bigint) => ({
  name: "gt" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg <= min)
      throw new Error(`${arg} is smaller than or equal to ${min}.`);
    return arg;
  },
});

export const gte = (min: bigint) => ({
  name: "gte" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg < min) throw new Error(`${arg} is smaller than ${min}.`);
    return arg;
  },
});

export const lt = (max: bigint) => ({
  name: "lt" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg >= max)
      throw new Error(`${arg} is greater than or equal to ${max}.`);
    return arg;
  },
});

export const lte = (max: bigint) => ({
  name: "lte" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg > max) throw new Error(`${arg} is greater than ${max}.`);
    return arg;
  },
});

export const positive = () => ({
  name: "positive" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg <= 0n) throw new Error(`${arg} is not a positive bigint.`);
    return arg;
  },
});

export const nonnegative = () => ({
  name: "nonnegative" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg < 0n) throw new Error(`${arg} is not a non-negative bigint.`);
    return arg;
  },
});

export const negative = () => ({
  name: "negative" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg >= 0n) throw new Error(`${arg} is not a negative bigint.`);
    return arg;
  },
});

export const nonpositive = () => ({
  name: "nonpositive" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg > 0n) throw new Error(`${arg} is not a non-positive bigint.`);
    return arg;
  },
});

export const multipleOf = (multiple: bigint) => ({
  name: "multipleOf" as const,
  $inputType: "bigint" as unknown as bigint,
  $outputType: "bigint" as unknown as bigint,
  parse: (arg: bigint) => {
    if (arg % multiple !== 0n)
      throw new Error(`${arg} is not a multiple of ${multiple}.`);
    return arg;
  },
});
