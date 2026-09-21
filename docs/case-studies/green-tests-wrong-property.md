# Case study: green tests, wrong property

## Failure

A set of host/fixture checks could pass while the intended firmware path was still not proven to participate in the selected target build.

In the private system, configuration/source-selection mistakes created exactly this kind of false confidence: code existed, nearby tests were green, but that did not establish that the production translation unit and board path were actually the ones being compiled and exercised.

## Why the tests were not useless

The tests proved real properties.

They proved properties such as:
- host-side logic behaved as expected;
- fixture code produced expected values;
- isolated components could compile or run.

The mistake was treating those properties as equivalent to the **task's actual claim**.

They were not.

## Claimed property

The relevant claim was closer to:

> "This exact source path is selected in the target firmware configuration and participates in the artifact that runs on the board."

That requires different evidence.

## Better verification

A stronger chain includes:

1. inspect the exact build configuration;
2. prove the expected source/object is a member of the target build;
3. use a negative compile canary when useful - deliberately break the expected translation unit and prove the target build fails;
4. build from a clean configuration to avoid stale-cache confidence;
5. run the exact artifact on the physical target when the claim is physical.

## Root lesson

**A passing test is only meaningful relative to the property it proves.**

The test suite did not "lie." The verification strategy asked it the wrong question.

This failure directly shaped Production Zoo's claim-driven verification model:

```text
task -> claimed property -> discriminating test -> evidence
```

rather than:

```text
implementation -> convenient tests -> green -> done
```
