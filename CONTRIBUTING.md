# Contributing

Open an issue before you start a large change, so we can agree on the approach first.

## Set up

```bash
bun install
bun run dev
```

## Before you open a pull request

Run the same checks as CI:

```bash
bun run lint
bun run test
bun run build
```

Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) format, for example `fix(audio): stop ambient sound when the session ends`.

Your pull request gets a preview on GitHub Pages, and a bot comments the link.

## Design rules

The app runs in a dark bedroom. Keep to the colors in `src/index.css`: the warm `night` and `ink` ramps and the one `ember` accent. Do not add blue or bright colors, glows or looping animations.

## Health claims

Do not add claims that the app treats sleep problems or changes brain waves. Describe the method as Jim Donovan's explanation.
