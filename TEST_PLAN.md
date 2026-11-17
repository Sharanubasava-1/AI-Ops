# Test and deployment verification

Run these checks in a disposable Google Sheet with `Test Mode Enabled=TRUE`, short SLA minutes, sample records, and email disabled first. Inspect `Test_Results`, `Completion_Log`, and `Escalation_Log` after each run.

| ID | Scenario | Evidence |
|---|---|---|
| TEST-01 | Complete a 7-day portal cycle and generate the next cycle | Pending row, Completion_Log, Task_Master next due |
| TEST-02 | Submit through the pending row/sidebar only | Pending row and audit entry |
| TEST-03 | Complete the daily task with a WhatsApp/update reference | Pending row and Completion_Log |
| TEST-04 | Process an overdue task and record the manager email outcome | Escalation_Log; `Sent` only means Gmail accepted the send |
| TEST-05 | Acknowledge without completing | Escalation_Log acknowledgement fields; pending cycle remains open |
| TEST-06 | Trigger unresolved and missing-ack leadership conditions | Separate leadership escalation rows |
| TEST-07 | Use shortened SLAs and resolve before processing | No leadership escalation after resolution |
| TEST-08 | Run automation repeatedly | Duplicate-prevention result and trigger count |

`sendTestManagerAlert`, `runManagerAcknowledgementTest`, `runLeadershipEscalationTest`, and `runDuplicatePreventionTest` record actual outcomes. A Gmail delivery cannot be marked successful until a configured recipient, OAuth grant, and enabled notification setting exist.

For production verification:

1. Configure real recipient addresses and employee emails.
2. Run diagnostics and confirm the active account/deployment mode.
3. Send one controlled manager alert.
4. Confirm the message in Gmail and the matching `Sent` row.
5. Confirm acknowledgement, completion, resolution, and suppression of later escalation.
6. Share the spreadsheet with the business users only after this verification. The requested submission contact is not granted access by default.
