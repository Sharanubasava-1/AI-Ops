# System architecture

Google Sheets is the operational database and user interface. `Task_Master` is configuration; `Employee_Pending_Report` is the current-cycle queue; `Completion_Log` and `Escalation_Log` are append-oriented audit histories. `Manager_Dashboard` is formula/report output, while `Configuration`, `Test_Results`, and `Audit_Log` hold settings and evidence.

Apps Script modules are separated by responsibility:

- `Config.gs`: schemas, settings, menu, shared helpers.
- `Spreadsheet.gs`: idempotent sheet creation, sample data, validation.
- `Recurrence.gs`: due-date calculation, working-day rules, unique cycle generation.
- `Completion.gs`: identity authorization, proof validation, completion history, resolution.
- `Notifications.gs`: overdue detection, Gmail delivery, acknowledgement, escalation.
- `Reporting.gs`: dashboard refresh and scheduled orchestration.
- `Triggers.gs`: non-duplicating hourly trigger installation.
- `Tests.gs`: executable evidence records.
- `UI.html`: optional same-row sidebar action.

Critical writes use `LockService`. Every cycle is keyed by `Task_ID + Cycle_Number`; notification uniqueness is keyed by `Cycle_ID + Alert_Stage + Alert_Type`; completion is keyed by `Cycle_ID`. A later scheduled run rechecks current status before sending an alert or escalation.

## Platform boundary

This project cannot create or share a production spreadsheet from an unauthenticated local folder. A user must run `initializeSystem` in their own Google account and grant OAuth permissions. Gmail delivery, active-user identity, and sharing must be verified in that authorized deployment. The project never sends or shares access with `hr.ops.allo@gmail.com` automatically.
