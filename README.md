# ALLO AI Operations Manager

This is a Google Apps Script project for recurring task tracking, same-row employee completion, manager alerts, acknowledgement, and leadership escalation. It is intentionally Sheets-first: the spreadsheet remains usable if the optional sidebar is not deployed.

## Setup

1. Create a blank Google Sheet and open **Extensions > Apps Script**.
2. Add the `.gs`, `.html`, and `appsscript.json` files from this folder (or upload with clasp).
3. Run `initializeSystem` once and grant the requested Sheets, Script, Gmail, and identity permissions.
4. Configure the `Configuration` sheet. Set manager/leadership recipients and only then set `Email Notification Enabled` to `TRUE`.
5. Replace the sample employee emails in `Task_Master`; sample names and tasks are marked as system-created.
6. Share the Sheet with employees as editors, protect system columns, and grant managers/admins the appropriate Sheet access.

`initializeSystem` is idempotent for sheets and sample tasks. Trigger installation removes and recreates only this project's `runDailyAutomation` trigger, preventing duplicates.

## Operating model

Employees edit completion fields in `Employee_Pending_Report` and choose `Completed`; a valid Ticket ID is required for portal tasks. Daily tasks require an employee-entered WhatsApp/update reference. This is proof supplied by the employee; there is no automatic WhatsApp verification.

`Recurrence_Basis=Completion` calculates the next due date from the actual completion timestamp. `Schedule` calculates from the previous scheduled due date. Missed due dates remain in the cycle history; the engine does not create another open cycle until the current one is completed.

Manager alerts are logged once per cycle/stage. Failed sends remain `Failed` with an error and can be retried by a later controlled run. Acknowledgement is independent from completion. Leadership escalation evaluates unresolved tasks and missing manager acknowledgement separately.

## Testing

Set `Test Mode Enabled=TRUE`, use short SLA values, and leave email disabled to validate records without sending mail. Run the menu test commands and inspect `Test_Results`, `Completion_Log`, and `Escalation_Log`. Real same-day email verification requires a configured recipient, Gmail authorization, and `Email Notification Enabled=TRUE`; it cannot be honestly claimed from local code inspection alone.

The eight acceptance scenarios are represented by the test-mode workflow: recurrence and daily completion through the sheet, single-point completion through the pending row/sidebar, manager alert logging, acknowledgement, both escalation conditions, timing with shortened SLAs, and duplicate checks. Test functions record evidence rather than marking an unexecuted external Gmail delivery as successful.

## Security and platform limitations

Server-side completion checks use the active Google account where Apps Script can provide it. Some consumer/domain deployments return an unavailable active-user email; in that case the record is explicitly marked `Unverified user`, and administrators should deploy as the accessing user or use a controlled domain. Frontend restrictions are not security controls.

Protect configuration, task-definition, status, and audit columns using Sheets protected ranges. Apps Script cannot create a shareable production spreadsheet or send mail until an authorized user runs it in their Google account. No access is shared with `hr.ops.allo@gmail.com` by this project.
