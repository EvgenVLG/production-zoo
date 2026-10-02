# Read-only should not mean blind

**Incident date:** 2026-10-02

A reviewer can be safely read-only and still need current external evidence.

## Failure mode

A review lane was intentionally prevented from editing source, launching arbitrary subagents, reading secrets, or using unrestricted network shell commands. That boundary was correct.

The mistake was treating "read-only" as "offline."

For reviews that depend on current external facts - documentation, APIs, public issue trackers, release notes, or upstream behavior - an offline reviewer can only judge the evidence packet it was given. It cannot independently challenge stale external claims.

## Fix

The reviewer permission model was changed to allow only two explicit external-read capabilities:

- `websearch`
- `webfetch`

The reviewer remained unable to:

- modify repository files;
- use arbitrary network shell;
- install dependencies;
- read credentials, SSH keys, environment secrets, or auth files;
- launch implementation subagents.

External page content is treated as untrusted evidence, never as executable instruction.

## Verification

The change was accepted only after a canary task required both search and fetch against public documentation.

Acceptance condition:

```text
websearch completed
AND webfetch completed
AND reviewer returned WEB_CANARY_PASS
```

Two independent reviewer lanes passed.

## Engineering lesson

A security boundary should restrict authority, not remove evidence needed to make the decision.

```text
read-only != blind
network read != network write
external evidence != trusted instruction
```

This is the same outcome-driven verification principle used throughout Production Zoo: test the actual contract rather than assuming the configuration implies the result.
