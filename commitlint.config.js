/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "build",
        "chore",
        "ci",
        "docs",
        "perf",
        "refactor",
        "style",
        "test",
        "revert",
      ],
    ],
    "subject-max-length": [2, "always", 72],
  },
};
