# Verification philosophy

Production Zoo uses **outcome-driven verification**.

The human owner defines the task's acceptance property before treating implementation evidence as sufficient.

## Three layers

### 1. Product outcome

What result is the system actually supposed to produce?

Example: "water the lawn effectively and uniformly."

### 2. Causal sub-properties

What intermediate behaviors must be true for that result?

Example:
- pump has pressure;
- valve actuates;
- water reaches each zone;
- flow is within range.

These checks matter because they isolate faults.

### 3. Verification-system calibration

Does each test actually measure the property it says it measures?

A test harness can be broken. A benchmark can parse the wrong object. A reviewer can inspect the wrong revision.

## Failure pattern to avoid

```text
easy-to-test component
 -> green check
 -> assumed system success
```

## Preferred pattern

```text
desired outcome
 -> causal model
 -> discriminating checks
 -> evidence from the right environment
 -> acceptance
```

This is not anti-unit-test. It is anti-proxy-confidence.

Good engineering uses component tests, integration tests, target builds, live observations and physical verification at the level needed by the claim.
