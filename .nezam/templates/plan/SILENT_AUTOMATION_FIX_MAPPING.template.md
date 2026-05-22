# Silent Automation Fix Mapping

| Category ID | Diagnose | Fix | Re-check |
| --- | --- | --- | --- |
| triggerMissing | Inspect workflow `on:` + filters | Update trigger/path/branch filters | Re-run qualifying event |
| workflowDisabledOrPaused | Check workflow status and org policy | Enable workflow and permissions | Confirm run appears |
| permissionDenied | Inspect token/env protection errors | Update permissions/scopes/rules | Re-run workflow |
| secretOrEnvMissing | Compare required env keys to runtime | Add missing keys and validate env target | Re-run workflow |
| runnerUnavailable | Inspect queue and runner labels | Restore runner/labels or change runner class | Confirm jobs start |
| jobDependencyDeadlock | Inspect `needs` and conditions | Repair DAG and conditions | Re-run dependency chain |
| externalServiceFailure | Check status/rate limits | Add retry/backoff and failover | Re-run with logs |
| logicRegression | Compare against last-known-good | Revert/fix workflow/scripts/actions | Re-run and compare evidence |
| reportingGap | Verify artifact + notification steps | Add mandatory evidence upload/reporting | Confirm evidence emitted |
