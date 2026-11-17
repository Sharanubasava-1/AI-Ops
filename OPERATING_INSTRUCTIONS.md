# Operating instructions

## Employees

1. Open `Employee_Pending_Report` and filter by your employee email/name.
2. Find rows marked `Pending` or `Overdue`; review the required proof type and due time.
3. Perform the work. For a portal task, copy the real ticket ID. For the daily operations task, post in WhatsApp and copy the message/update reference.
4. Use **Open Employee Sidebar**, select the row's `Cycle_ID`, enter proof and notes, and submit. The server validates the assigned employee, records the signed-in account when available, writes the completion log, and schedules the next cycle.
5. Do not edit historical completion or escalation records. If account identity is unavailable, contact the administrator; a manually typed employee name is not treated as secure authentication.

## Managers

1. Review `Manager_Dashboard` for live counts and employee/task details.
2. Open the corresponding escalation row, review the original due date and proof requirement, and run the acknowledgement action with comments.
3. Acknowledgement does not complete the task. The employee must submit completion separately.
4. Resolve operational issues through the employee workflow; the system marks an escalation resolved when the cycle is completed.

## Administrators

Configure recipients, time zone, working days, holidays, due time, and SLA minutes in `Configuration`. Set employee emails in `Task_Master`, protect system columns, and enable email only after sending a controlled test.
