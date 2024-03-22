# correttore

A **proof of concept** of a tree shakable [Zod](https://zod.dev/) alternative.
This library aims to have a 1:1 Zod compatible API, but with fine grain control over the final bundle size.
This was done by a combination of Proxies and type-level programming.

🤓 You can read the [blog post](https://softwaremill.com/a-novel-technique-for-creating-ergonomic-and-tree-shakable-typescript-libraries/) to learn how it works.

## Usage

```ts
// 1. import `initCorrettore` and features (validator) you want to use
import { initCorrettore, string, email, min, object } from "correttore"; // 0.54 kB

// 2. init the entrypoint variable `c`. It corresponds to Zod's `z`.
export const c = initCorrettore([string, email, min, object]);

// 3. create schemas. Autocompletion will only show methods passed to `initCorrettore`.
// the `object` method is always available
const loginSchema = c.object({
  email: c.string().email(),
  password: c.string().min(5),
});

// 4. Infer type from schema:
import type { Infer } from "correttore";

type LoginSchema = Infer<typeof loginSchema>;
//   ^? {
//       email: string;
//       password: string;
//     }

// 5. Parse unknown data
const parsed = loginSchema.parse({
  email: "hello@test.com",
  password: "password123",
});

// this will throw
loginSchema.parse({
  email: "hello@test.com",
  // missing field
});
```

## Installation

> **Note:** This library is not production ready, I implemented only a handful of parsers as a PoC.
> If you're interested in this project, check out the [contributing](#contributing) section.

```sh
# choose your package manager
pnpm add correttore
yarn add correttore
npm install correttore
```

## Comparison with Zod

### Zod:

```ts
import { z } from "zod"; // 12.8 kB

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Throws error
LoginSchema.parse({ email: "", password: "" });

// Returns data as { email: string; password: string }
LoginSchema.parse({ email: "jane@example.com", password: "12345678" });
```

### Correttore:

```ts
import { email, min, initCorrettore, string, object } from "correttore"; // 0.54 kB

export const c = initCorrettore([string, email, min, object]);

const LoginSchema = c.object({
  email: c.string().email(),
  password: c.string().min(8),
});

// Throws error
LoginSchema.parse({ email: "", password: "" });

// Returns data as { email: string; password: string }
LoginSchema.parse({ email: "jane@example.com", password: "12345678" });
```

## Contributing

If you're interested in helping to bring this project to a production ready state, feel free to open a PR with changes that will bring it closer to a 1:1 Zod compatible API.

List of stuff to do:

- [ ] Add more APIs (refer to the Roadmap (https://github.com/mieszkosabo/correttore/issues/2) to find out what needs to be done)
- [ ] Add tests
- [ ] Add docs/guides
- [ ] Create premade "bundles" of popular subsets of APIs users may want to import
