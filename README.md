# 317 UI Common

Components shared by the [317 SMS site](https://github.com/BenMcD23/317_SMS_Site)
and the [317 cadet portal](https://github.com/BenMcD23/317_Cadet_Portal): the
shadcn/ui parts both use, `OrderDisclosure`, `ResponsiveDialog`, `EmptyState`,
`ErrorAlert`, `PageHeader`, `SectionHeading`, `useIsMobile` and `cn`. One copy,
so a cadet and the stores team see the same component behave the same way.

```tsx
import { Button } from "@317/ui-common/components/ui/button";
import { OrderDisclosure, OrderList } from "@317/ui-common/components/order-disclosure";
import { cn } from "@317/ui-common/lib/utils";
```

It ships as TypeScript source, with no build step: each app compiles it with
its own Next.js and Tailwind. The apps supply React, Radix and the other
libraries (`peerDependencies`), so there is only ever one of each.

## Using it in an app

Each app has, once:

- the dependency, pinned to a release asset (see below):
  `"@317/ui-common": "https://github.com/BenMcD23/317-UI-Common/releases/download/v1.0.0/317-ui-common-1.0.0.tgz"`
- `transpilePackages: ["@317/ui-common"]` in `next.config.ts`, so Next
  compiles the source;
- `@source "../node_modules/@317/ui-common/src";` in `app/globals.css`, so
  Tailwind generates the classes these components use. The colours and radii
  are the app's own theme tokens.

## Changing a component

1. Change it here, with a test. `npm run check && npm run format:check`.
2. Try it in both apps before releasing: in each, `npm install ../317-ui-common`
   (a local checkout beside them), run its checks and look at it in the
   preview. Don't commit that install.
3. Bump `version` in `package.json` (patch for a fix, minor for something new,
   major if an app has to change its code) and merge.
4. Tag the merge commit: `git tag v1.2.3 && git push origin v1.2.3`. The
   Release workflow tests it again, packs it and attaches the file to a GitHub
   release.
5. In each app, point the dependency at the new release's URL, `npm install`,
   and open a pull request.

New shadcn components go here too, in `src/components/ui`, with their imports
made relative (`../../lib/utils`, not `@/lib/utils`): inside an app's
`node_modules`, `@/` would resolve to the app. A test fails if one slips in.
