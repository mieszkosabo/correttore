export const max = (maxLength: number) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "max" as const,
  parse: (arg: string) => {
    if (arg.length > maxLength)
      throw new Error(`${arg} exceeds maximum length of ${maxLength}.`);
    return arg;
  },
});

export const min = (minLength: number) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "min" as const,
  parse: (arg: string) => {
    if (arg.length < minLength)
      throw new Error(`${arg} is shorter than minimum length of ${minLength}.`);
    return arg;
  },
});

export const length = (exactLength: number) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "length" as const,
  parse: (arg: string) => {
    if (arg.length !== exactLength)
      throw new Error(
        `${arg} does not have the expected length of ${exactLength}.`,
      );
    return arg;
  },
});

export const email = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "email" as const,
  parse: (arg: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(arg)) throw new Error(`${arg} is not a valid email.`);
    return arg;
  },
});

export const url = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "url" as const,
  parse: (arg: string) => {
    try {
      new URL(arg);
    } catch (error) {
      throw new Error(`${arg} is not a valid URL.`);
    }
    return arg;
  },
});

export const emoji = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "emoji" as const,
  parse: (arg: string) => {
    const emojiRegex = /[\p{Emoji}]/u;
    if (!emojiRegex.test(arg))
      throw new Error(`${arg} does not contain any emoji.`);
    return arg;
  },
});

export const uuid = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "uuid" as const,
  parse: (arg: string) => {
    const uuidRegex = /^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i;
    if (!uuidRegex.test(arg)) throw new Error(`${arg} is not a valid UUID.`);
    return arg;
  },
});

export const cuid = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "cuid" as const,
  parse: (arg: string) => {
    const cuidRegex = /^[a-z\d]{24}$/i;
    if (!cuidRegex.test(arg)) throw new Error(`${arg} is not a valid cuid.`);
    return arg;
  },
});

export const cuid2 = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "cuid2" as const,
  parse: (arg: string) => {
    const cuid2Regex = /^[a-z\d]{25}$/i;
    if (!cuid2Regex.test(arg)) throw new Error(`${arg} is not a valid cuid2.`);
    return arg;
  },
});

export const ulid = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "ulid" as const,
  parse: (arg: string) => {
    const ulidRegex = /^[0-9A-Z]{26}$/;
    if (!ulidRegex.test(arg)) throw new Error(`${arg} is not a valid ulid.`);
    return arg;
  },
});

export const regex = (pattern: RegExp) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "regex" as const,
  parse: (arg: string) => {
    if (!pattern.test(arg))
      throw new Error(`${arg} does not match the expected pattern.`);
    return arg;
  },
});

export const includes = (substring: string) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "includes" as const,
  parse: (arg: string) => {
    if (!arg.includes(substring))
      throw new Error(`${arg} does not include ${substring}.`);
    return arg;
  },
});

export const startsWith = (prefix: string) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "startsWith" as const,
  parse: (arg: string) => {
    if (!arg.startsWith(prefix))
      throw new Error(`${arg} does not start with ${prefix}.`);
    return arg;
  },
});

export const endsWith = (suffix: string) => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "endsWith" as const,
  parse: (arg: string) => {
    if (!arg.endsWith(suffix))
      throw new Error(`${arg} does not end with ${suffix}.`);
    return arg;
  },
});

export const datetime = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "datetime" as const,
  parse: (arg: string) => {
    const dateObject = new Date(arg);
    if (isNaN(dateObject.getTime()))
      throw new Error(`${arg} is not a valid date.`);
    return arg;
  },
});

export const ip = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "ip" as const,
  parse: (arg: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(arg))
      throw new Error(`${arg} is not a valid IP address.`);
    return arg;
  },
});

export const trim = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "trim" as const,
  parse: (arg: string) => arg.trim(),
});

export const toLowerCase = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "toLowerCase" as const,
  parse: (arg: string) => arg.toLowerCase(),
});

export const toUpperCase = () => ({
  $inputType: "string" as unknown as string,
  $outputType: "string" as unknown as string,
  name: "toUpperCase" as const,
  parse: (arg: string) => arg.toUpperCase(),
});
