export type EmailValidator = {
  email: typeof email;
};

export const email = () => ({
  parse(arg: string): string {
    // just a silly check
    if (!arg.includes("@")) {
      throw new Error("Not an email!");
    }
    return arg;
  },
});
