# Production Zoo

**A controlled multi-model engineering production system.**

Different AI models have different specialties, costs and failure modes. Production Zoo treats them like technicians in a real service shop: assign work according to capability and risk, keep the job bounded, inspect the result independently, and verify the claimed property instead of trusting a green dashboard.

It grew out of building The Nest and Marinka. What started as "use an LLM to help write the code" became a repeatable engineering workflow because model confidence, reviewer agreement and generic green tests repeatedly turned out to be weaker evidence than they looked.

> **Core rule:** a passing test matters only if it exercises the property the task actually claims.

## What this candidate demonstrates

The v0.1 demo is keyless and deterministic:

```
task contract
  -> isolated Git worktree
  -> deterministic worker
  -> R0 verification
  -> independent review fixture bound to the candidate SHA
  -> local integration receipt
```

The worker is replaceable. The control process is the product.

## Why "Zoo"?

Because the private system really did become a zoo of models: fast ones, expensive ones, specialists, generalists and cheap workers. The useful engineering move was not finding one "best" model. It was learning how to route work, constrain it, verify it and escalate only when necessary.

The service-shop analogy comes from years of lead-technician work: a foreman does not assign every repair to the first available technician. Capability, risk, cost and verification matter.

## Run

Requires Node.js 22+ and Git.

```sh
npm test
npm run demo
```

The demo creates a disposable Git repository and a real worktree, performs one bounded edit, runs the claim-specific test, creates a review receipt tied to the exact commit, then fast-forwards the local integration branch.

## Evidence boundary

This candidate demonstrates workflow mechanics with deterministic workers and reviewers. It does **not** claim independent LLM review, production deployment or autonomous software engineering.

Rottweiler/watchdog recovery is intentionally omitted from v0.1 until its private operational acceptance is complete.

## Status

Candidate, not yet a public release. License and clean-room gates remain pending.
