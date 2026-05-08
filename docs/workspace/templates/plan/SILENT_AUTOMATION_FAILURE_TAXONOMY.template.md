# Silent Automation Failure Taxonomy

| Category ID | Signal | Typical Cause | Default Severity |
| --- | --- | --- | --- |
| triggerMissing | Expected workflow did not run | Trigger/filter mismatch | sev2 |
| workflowDisabledOrPaused | Workflow exists but does not execute | Disabled workflow/policy block | sev2 |
| permissionDenied | Workflow fails on auth/permissions | Missing token scopes/env protection mismatch | sev1 |
| secretOrEnvMissing | Workflow fails due to config | Missing secret or env key | sev2 |
| runnerUnavailable | Job remains queued/stuck | Runner offline/capacity issue | sev2 |
| jobDependencyDeadlock | Jobs skip/wait indefinitely | Invalid `needs` graph or conditions | sev2 |
| externalServiceFailure | API/service outage or rate limits | Upstream dependency issue | sev3 |
| logicRegression | Workflow passes but contract broken | Script/action drift | sev1 |
| reportingGap | Workflow runs without evidence | Artifact or notification path broken | sev2 |
