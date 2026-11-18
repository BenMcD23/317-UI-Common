# 317 UI Common conventions

Components shared by the 317 SMS site and the cadet portal, as a package of
TypeScript source the apps compile themselves. The README covers how the apps
use it and how a change is released; read it first. The look and feel rules
are the SMS site's (its CLAUDE.md): tokens not literal colours, flat cards,
phone first, lucide icons only.

## Rules

- **Imports inside the package are relative.** `@/…` would resolve to the
  consuming app inside its `node_modules`. `src/package.test.ts` fails on one.
- **Libraries are peer dependencies.** Anything a component imports (React,
  Radix, motion, vaul…) goes in `peerDependencies` and, for this repo's own
  tests, `devDependencies`. The package must never bring a second copy of
  React or Radix into an app. The same test checks the list.
- **Every file under `src/` is reachable** through the `exports` map in
  `package.json` (`@317/ui-common/components/…`, `/hooks/…`, `/lib/…`).
- **Nothing app-specific.** No routes, API calls, session or app copy here. A
  component that needs one takes it as a prop.
- **Breaking a component's props is a major version**, and both apps' pull
  requests for it go together.
- `src/components/ui` holds shadcn files in the style shadcn generates
  (prettier skips them, as in both apps). Everything else is prettier with
  semicolons.

## Tests

Every change ships with tests, next to the code (`order-disclosure.tsx` →
`order-disclosure.test.tsx`), in Vitest and Testing Library like the apps: Node
by default, `// @vitest-environment jsdom` on line 1 for a DOM, query by role
and accessible name, name the test after the behaviour. `npm run check` is
typecheck and tests; `npm run format:check` is CI's formatting step.

Before releasing, try the change in both apps (`npm install ../317-ui-common`
in each, then `npm run check` and a look in the preview): this repo's tests
can't see how an app uses a component.

## Branches and pull requests

- Branch off `main` and open a pull request into it. CI (`check`) must pass.
  Changes under `.github/` need @BenMcD23's review (`.github/CODEOWNERS`).
- Releases are tags on `main` (`vX.Y.Z`, matching `package.json`); the Release
  workflow refuses a tag that doesn't match.
- Fill in the pull request template.
