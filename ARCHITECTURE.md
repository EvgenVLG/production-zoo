# Production Zoo architecture

Production Zoo separates **engineering authority** from replaceable AI/model workers.

```
Task contract
  -> coordinator / role selection
  -> isolated worktree
  -> worker implementation
  -> claim-specific R0 checks
  -> independent review receipt
  -> controlled integration
                 |
                 +-> bounded recovery/watchdog
```

## Authority

Workers may modify only their assigned workspace and paths. They do not own release or publication authority.

A review verdict is not execution evidence. Compilation, fixtures, live-service checks and physical verification remain separate evidence classes.

## Recovery principle

Prompt delivery is not execution progress.

The watchdog model distinguishes delivery, session observation, useful progress and durable checkpoints. Its default mode is observation; recovery is conservative and bounded.

## v0.1 boundary

The public candidate uses deterministic fixture workers/reviewers and a pure watchdog FSM so the control-plane mechanics are reproducible without external model providers.

The watchdog code here is a generic rewrite. It demonstrates policy/classification in fixtures, not a live OpenCode service.
