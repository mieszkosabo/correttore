function isString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new Error("Not a string!");
  }
}

function isNumber(x: unknown): asserts x is number {
  if (typeof x !== "number") {
    throw new Error("Not a number!");
  }
}

type AssertFn<T> = (arg: unknown) => asserts arg is T;
type ParseFn<T> = (arg: any) => T;
type Parser<T> = {
  parse: ParseFn<T>;
};

const c = {
  string: () => ({
    parse(arg: unknown): string {
      isString(arg);
      return arg;
    },
    email: () => ({
      parse(arg: unknown): string {
        isString(arg);
        // just a silly check
        if (!arg.includes("@")) {
          throw new Error("Not an email!");
        }
        return arg;
      },
    }),
  }),
  number: () => ({
    parse(arg: unknown): number {
      isNumber(arg);
      return arg;
    },
  }),

  object<T, S extends Record<string, Parser<T>>>(schema: S) {
    function validate(arg: unknown): asserts arg is {
      [K in keyof S]: ReturnType<S[K]["parse"]>;
    } {
      if (!arg) throw new Error("Not an object!");
      if (typeof arg !== "object") throw new Error("Not an object!");
      if (Array.isArray(arg)) throw new Error("Not an object!");

      for (const k of Object.keys(schema)) {
        if (k in arg) {
          schema[k].parse((arg as any)[k]);
        } else {
          throw new Error(`Missing property ${k}`);
        }
      }
    }

    return {
      parse(arg: unknown) {
        validate(arg);
        return arg;
      },
    };
  },
};

const userSchema = c.object({
  name: c.string(),
  email: c.string().email(),
  address: c.object({
    street: c.string(),
    streetNumber: c.number(),
    city: c.string(),
  }),
});

const user1 = userSchema.parse({
  name: "John",
  email: "johnyy@example.com",
  address: {
    street: "Main Street",
    streetNumber: 123,
    city: "Little Rock",
  },
});

console.log(user1);

const user2 = userSchema.parse({
  name: "John",
  email: "johnyy@example.com",
  address: {
    street: "Main Street",
    streetNumber: "123",
    // missing city
  },
});
