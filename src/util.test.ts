import { describe, expect, test } from "vitest";
import { getBranch, getColor, getRefUrl } from "./util";

test("getColor", () => {
  expect(getColor("success")).toBe("#2eb886");
  expect(getColor("cancelled")).toBe("#daa038");
  expect(getColor("failure")).toBe("#a30200");
  expect(getColor("unknown")).toBe("#1d9bd1");
});

test("getBranch", () => {
  process.env.GITHUB_HEAD_REF = "sample";
  expect(getBranch("ref/heads/sample/feature")).toBe("sample/feature");
  expect(getBranch("ref/pull/2222")).toBe("sample");
  expect(getBranch("(undefined)")).toBe("unknown");
});

test("getRefUrl", () => {
  const repoUrl = "https://example.com";
  expect(getRefUrl(repoUrl, "ref/heads/sample/feature")).toBe(
    "https://example.com/tree/sample/feature",
  );
  expect(getRefUrl(repoUrl, "ref/pull/2222")).toBe(
    "https://example.com/pull/2222",
  );
  expect(getRefUrl(repoUrl, "(undefined)")).toBe(repoUrl);
});
