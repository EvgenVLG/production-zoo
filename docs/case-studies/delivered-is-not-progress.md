# Case study: delivered is not progressing

## Failure

A development task could remain marked `RUNNING` while its OpenCode session was interrupted or idle. Amendments had prompt IDs and appeared delivered, yet no useful work or WIP checkpoint followed.

A manual nudge caused work to resume immediately.

## Wrong assumption

The control plane treated successful prompt delivery as a useful proxy for execution progress.

It was not.

## Architecture change

The recovery design separates amendment/session evidence:

```
DISCOVERED
 -> SENT
 -> OBSERVED_IN_SESSION
 -> PROGRESS_AFTER_AMENDMENT
 -> CHECKPOINTED
```

A watchdog combines queue state, session activity, permission/question waits, context progress and WIP progression. Ambiguous states fail closed.

Recovery is bounded. Permission waits, user questions, paused/cancelled work and identity mismatches are never auto-resumed.

## Verification

The private operational implementation was completed and reviewed on 2026-09-21 at source revision `5fb5b79ad7029064efffc593a311601d5aefa09b`.

This public candidate contains a **genericized pure-FSM fixture**, not the private service implementation. Its tests prove classification/recovery rules only; they do not claim a live OpenCode deployment.

## Lesson

**SENT != OBSERVED != PROGRESS.**

An API acknowledgement is transport evidence, not evidence that useful work happened.
