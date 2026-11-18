import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import pkg from "../package.json" with { type: "json" };

const root = join(import.meta.dirname, "..");

function sourceFiles(dir = join(root, "src")): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [relative(root, path)] : [];
  });
}

/** The import specifier an app would use for `file`, from the exports map. */
function specifierFor(file: string): string | null {
  for (const [pattern, target] of Object.entries(pkg.exports)) {
    const [prefix, suffix] = target.slice(2).split("*");
    if (file.startsWith(prefix) && file.endsWith(suffix)) {
      return `${pkg.name}/${pattern.slice(2).replace("*", file.slice(prefix.length, -suffix.length))}`;
    }
  }
  return null;
}

describe("the package as the apps see it", () => {
  const files = sourceFiles();

  it.each(files)("%s imports nothing through the apps' @/ alias", (file) => {
    // Inside node_modules "@/…" resolves against the app that installed the
    // package, so a slip here would quietly use the app's own copy (or break
    // only in one app). Everything in here imports relatively.
    expect(readFileSync(join(root, file), "utf8")).not.toMatch(/from ["']@\//);
  });

  it.each(files)("%s can be imported by the apps", (file) => {
    expect(specifierFor(file)).not.toBeNull();
  });

  it("names files the way the apps import them", () => {
    expect(specifierFor("src/components/ui/button.tsx")).toBe("@317/ui-common/components/ui/button");
    expect(specifierFor("src/components/order-disclosure.tsx")).toBe(
      "@317/ui-common/components/order-disclosure"
    );
    expect(specifierFor("src/lib/utils.ts")).toBe("@317/ui-common/lib/utils");
    expect(specifierFor("src/hooks/use-mobile.ts")).toBe("@317/ui-common/hooks/use-mobile");
  });

  it("asks the apps for every library it imports rather than bringing its own", () => {
    // Two Reacts (or two Radix contexts) in one app break hooks and dialogs.
    const imported = new Set(
      files.flatMap((file) =>
        [...readFileSync(join(root, file), "utf8").matchAll(/from ["']([^."'][^"']*)["']/g)].map(
          ([, spec]) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
        )
      )
    );
    expect([...imported].sort()).toEqual(
      Object.keys(pkg.peerDependencies)
        .filter((dep) => dep !== "react-dom")
        .sort()
    );
  });
});
