# correttore

A **proof of concept** of a tree shakable [Zod](https://zod.dev/) alternative.
This library aims to have a 1:1 Zod compatible API, but with fine grain control over the final bundle size.

🤓 You can read the [blog post](https://softwaremill.com/a-novel-technique-for-creating-ergonomic-and-tree-shakable-typescript-libraries/) to learn how it works. 

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
import { email, minLength, object, initCorrettore, string } from "correttore"; // 0.54 kB

export const c = initCorrettore({
  string,
  email,
  object,
  minLength,
});

const LoginSchema = c.object({
  email: c.string().email(),
  password: c.string().minLength(8),
});

// Throws error
LoginSchema.parse({ email: "", password: "" });

// Returns data as { email: string; password: string }
LoginSchema.parse({ email: "jane@example.com", password: "12345678" });
```

## Contributing

If you're interested in helping to bring this project to a production ready state, feel free to open a PR with changes that will bring it closer to a 1:1 Zod compatible API.

List of stuff to do:

- [ ] Add more parsers/validators
- [ ] Add tests
- [ ] Add the `Infer` type
