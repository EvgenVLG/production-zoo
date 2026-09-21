# Case study: the evaluator tested the wrong contract

## Failure

During provider reliability research, an evaluation helper reported every successful result as schema-invalid.

At first glance this looked like a model/provider quality problem.

It was not.

## Root cause

The production parser expected **raw model text**. The evaluation helper accidentally passed it an **already-parsed object**.

In JavaScript the object was coerced to a string representation that the parser could not treat as the expected JSON payload, so the evaluator marked rows invalid.

The bug was in the measurement path.

## Why this matters

A benchmark, test harness or reviewer can be wrong too.

If the verification system is not calibrated, it can produce highly confident nonsense about the product it is supposed to measure.

That means "test the tests" is necessary - but only in service of the real task.

## Correction

The evaluator was changed to pass the raw response through the same parsing/validation contract used by production.

Known-valid and known-invalid controls are the right way to calibrate such a harness before trusting leaderboard results.

The corrected run then separated:
- transport success;
- parse success;
- schema validity;
- semantic quality;
- latency/retry behavior.

## Root lesson

**Verification must be both relevant and trustworthy.**

There are two different questions:

1. Does this check objectively measure what it claims to measure?
2. Is that measured property actually the property the product/task needs?

Both must be true.

A perfectly implemented valve test still does not prove a lawn was irrigated. A broken evaluator is even worse: it does not reliably prove the valve test either.
