# Svelte project template

## Requirements

Following tools should be pre-installed:

- [Node.js](https://nodejs.org/en/) >= v16.18.0 – JavaScript runtime environment
- [pnpm](https://pnpm.io/) >= v7.x – package manager

## Installation

[pnpm](https://pnpm.io/) is used as a package manager, since it's a more efficient alternative to
[npm](https://pnpm.io/motivation).

Install project's dependencies using a following command:

```bash
pnpm i
```

## Developing

Once you've cloned a repository and installed dependencies, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open

# or start the server under HTTPS
pnpm dev --https
```

## Building

To create a production build:

```bash
pnpm build
```

The production build can be previewed locally by running:

```bash
pnpm preview
```

To run production build using `node`:

```bash
node build
```

## Storybook

Storybook is used a primary tool for developing UI components in isolation. This allows to describe
all necessary states of the component to test it accordingly.

To start storybook run:

```bash
pnpm storybook
```
