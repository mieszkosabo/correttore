import { Validator } from "./util-types";

export const string: Validator<unknown, string> = () => (arg) => {
  if (typeof arg !== "string") throw new Error(`${arg} is not a string.`);
  return arg;
};

export const number: Validator<unknown, number> = () => (arg) => {
  if (typeof arg !== "number") throw new Error(`${arg} is not a number.`);
  return arg;
};

export const email: Validator<string, string> = () => (arg) => {
  if (!arg.includes("@")) throw new Error(`${arg} is not an email.`);
  return arg;
};

export const minLength: Validator<string, string, [minLength: number]> =
  (minLength) => (arg) => {
    if (arg.length < minLength)
      throw new Error(`${arg} is shorter than ${minLength} characters.`);
    return arg;
  };

export const min: Validator<number, number, [min: number]> = (min) => (arg) => {
  if (arg < min) throw new Error(`${arg} is smaller than ${min}.`);
  return arg;
};
