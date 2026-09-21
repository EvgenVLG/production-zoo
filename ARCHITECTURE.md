# Production Zoo architecture

Production Zoo separates **human engineering ownership** from replaceable AI/model labor.

The design target is controlled and efficient production, not autonomous development.

```text
Human owner
  |
  +-> architecture / requirements / acceptance / risk
  |
Task contract
  -> role selection
  -> isolated worktree
  -> bounded worker implementation or research
  -> claim-specific R0 checks
  -> independent review when useful
  -> controlled integration
  -> release / publication decision
  |
  +-> watchdog / recovery / evidence
```

## Authority model

The human owner is the engineering authority.

Workers may:
- research;
- propose;
- implement within an assigned boundary;
- run permitted tests;
- review a frozen change.

Workers may not:
- redefine the task without approval;
- expand their own permissions;
- declare an unrelated proxy test sufficient;
- self-approve release;
- convert model confidence into evidence.

## Verification is outcome-driven

Verification is derived from the **claimed property**.

For every task:

```text
task
 -> claimed property
 -> discriminating test or observation
 -> evidence
 -> acceptance / rework
```

This prevents a common failure mode where a team proves that a convenient component works while never proving the product outcome.

Example: a sprinkler valve opening is not the same claim as the lawn being watered effectively. The valve test is useful, but the system-level acceptance must observe the actual irrigation outcome.

The same distinction appears in software and physical systems:
- unit logic vs target build membership;
- transport success vs useful semantic output;
- prompt delivery vs causal progress;
- model review vs compilation;
- command acknowledgement vs observed physical effect.

## Evidence classes

Evidence types stay separate:

- source inspection;
- compilation / target-build evidence;
- fixture verification;
- live-service verification;
- physical-hardware verification;
- quality testing against an explicit metric/population.

Review is additional evidence. It does not replace execution evidence.

## R&D loop

Production Zoo continuously evaluates engineering tooling - model providers, agent runtimes, MCP integrations, plugins/skills, context strategies, review mechanisms and recovery controls.

The adoption rule is simple:

> add a tool only if it measurably improves a production property such as reliability, throughput, cost, reproducibility, observability or verification quality.

## Recovery principle

Prompt delivery is not execution progress.

The watchdog distinguishes delivery, session observation, useful progress and durable checkpoints. Recovery is conservative and bounded. Permission waits, questions, unknown ownership and explicit pauses are not treated as ordinary stalled work.

## Public beta boundary

The public v0.1 implementation uses deterministic fixture workers/reviewers and a pure watchdog FSM so the control-plane mechanics are reproducible without external providers.

The larger private system contains broader live integrations. The public repository is a sanitized reference implementation, not a mirror of private sessions, credentials or infrastructure.
