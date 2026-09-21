# Production Zoo

**A human-owned, controlled multi-model engineering production system.**

**Public beta: v0.1**

Production Zoo is not an autonomous software-development system. Autonomy is not the goal.

It is a control system for AI-assisted engineering: a human owner defines the problem, boundaries, acceptance criteria, risk and release decision; specialized AI workers perform bounded research, implementation and review; verification is designed around the result the task actually claims.

> **Models are labor. The human is the owner. Evidence decides whether the work is done.**

Production Zoo grew out of building [The Nest](https://github.com/EvgenVLG/the-nest-runtime) and [Marinka](https://github.com/EvgenVLG/marinka-assistant). A simple "give the model a prompt and trust the answer" workflow repeatedly failed in ways that looked convincing: green tests that did not prove the production path, review logic that tested the wrong contract, accepted prompts that produced no progress, context growth, stale state and confident completion messages without enough evidence.

The response was not "make the agents more autonomous." It was the opposite: **make the production process more controlled, observable, efficient and outcome-driven.**

## Operating model

```text
Human owner
  -> defines task, constraints, acceptance and risk
  -> assigns / approves worker role
  -> bounded implementation or research
  -> claim-specific verification
  -> independent review where useful
  -> integration / release gate
  -> evidence-backed result
```

The owner can delegate work. The owner does not delegate ownership.

Workers are selected by capability, cost, latency and risk. They are replaceable resources, not authorities.

## Verification philosophy

The core question is not:

> "Which tests can we make pass?"

It is:

> **"What property does this task claim, and what observation would discriminate between that property being true or false?"**

A component test can be valid and still be irrelevant to the real outcome.

A sprinkler controller is not proven because a valve toggles. The claimed product outcome is that the lawn is watered effectively and uniformly. Valve actuation is useful intermediate evidence, but it is not the final property.

The same principle applies here:

- a source-level unit test does not prove a file entered the target firmware build;
- an HTTP 200 does not prove useful model output;
- an accepted prompt does not prove an agent is progressing;
- a review verdict does not prove the code compiled or ran;
- model prose saying "Done" does not prove a physical action happened.

This is why Production Zoo separates source inspection, compilation, fixture execution, live-service observation, physical-hardware verification and quality testing instead of collapsing them into one generic "green" state.

## What the system is designed to improve

Production Zoo exists to improve engineering production, not to maximize agent autonomy.

It targets:

- higher useful throughput from AI-assisted development;
- lower wasted context and repeated work;
- better task-to-model assignment;
- bounded implementation scope;
- faster recovery from interrupted or stalled work;
- stronger distinction between activity and progress;
- verification tied to acceptance criteria;
- reproducible handoffs and checkpoints;
- explicit integration and release ownership;
- measurable evidence instead of confidence.

## R&D and technology scouting

The system is intentionally evolutionary.

Ongoing R&D tracks changes in:

- coding-agent runtimes and orchestration patterns;
- model/provider APIs and routing behavior;
- MCP-compatible integrations and developer tools;
- plugins, skills and tool-use mechanisms;
- context-management and retrieval strategies;
- independent review patterns;
- cost/latency/quality tradeoffs;
- recovery, checkpointing and release controls.

New tooling is adopted only when it improves a useful engineering property - reliability, throughput, cost, observability, reproducibility or verification quality. Novelty by itself is not a reason to add another model or plugin to the zoo.

## Public beta v0.1

The public repository is a sanitized reference implementation derived from a larger privately operated engineering system.

The v0.1 path is deliberately keyless and reproducible:

```text
task contract
  -> isolated Git worktree
  -> deterministic fixture worker
  -> claim-specific R0 verification
  -> independent review fixture bound to the candidate SHA
  -> local integration receipt
```

Run it with Node.js 22+ and Git:

```sh
npm test
npm run demo
```

The public beta demonstrates the control mechanics without requiring paid model access or exposing private task history, credentials, household data or raw development sessions.

## Failure-driven design

The architecture was shaped by failures, not only by successful demos.

### 1. [Green tests, wrong property](docs/case-studies/green-tests-wrong-property.md)

Host/fixture tests passed while the intended production firmware path was not actually proven. The verification strategy changed from "tests are green" to target-build membership, negative controls and exact-path evidence.

### 2. [The evaluator tested the wrong contract](docs/case-studies/evaluator-contract-bug.md)

An evaluation helper passed an already-parsed object into a validator that expected raw model text. Every result appeared schema-invalid. The bug was in the evaluator, not the model output. The lesson: **verification itself must be calibrated and tested against known controls.**

### 3. [Delivered is not progressing](docs/case-studies/delivered-is-not-progress.md)

A prompt could be accepted while useful work had stopped. The control plane now distinguishes `SENT`, `OBSERVED_IN_SESSION`, `PROGRESS_AFTER_AMENDMENT` and `CHECKPOINTED`.

## Human technical ownership

My role in the system is not "submit a prompt and wait."

The human technical owner:

- defines architecture and component boundaries;
- decomposes work and chooses what may be delegated;
- selects acceptance criteria before implementation;
- assigns work according to capability, cost and risk;
- reviews evidence and changes the verification strategy when it proves the wrong property;
- stops or redirects workers when they drift;
- decides integration, release and publication;
- owns the final engineering outcome.

AI workers accelerate research, implementation and review. They do not own the product, the architecture or the release decision.

## Status and evidence

This repository is a **working public beta v0.1 reference implementation**.

The public CI exercises the included deterministic workflow and tests. Claims about the larger private system are described as origin/history, not silently promoted to public fixture evidence.

Production Zoo is intentionally controlled, human-owned and evidence-driven.

## Related projects

- [The Nest](https://github.com/EvgenVLG/the-nest-runtime) - deterministic environment authority and orchestration.
- [Marinka](https://github.com/EvgenVLG/marinka-assistant) - portable personal AI assistant runtime.

The repositories are separate by design. Production Zoo builds and verifies systems like them; it is not a runtime dependency of either project.
