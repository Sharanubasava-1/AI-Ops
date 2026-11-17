var ALLO = ALLO || {};
ALLO.SHEETS = {
  TASKS: 'Task_Master', PENDING: 'Employee_Pending_Report', COMPLETIONS: 'Completion_Log',
  DASHBOARD: 'Manager_Dashboard', ESCALATIONS: 'Escalation_Log', CONFIG: 'Configuration',
  TESTS: 'Test_Results', AUDIT: 'Audit_Log'
};
ALLO.HEADERS = {};
ALLO.HEADERS.Task_Master = ['Task_ID','Task_Name','Task_Description','Assigned_Employee','Employee_Email','Frequency','Recurrence_Basis','First_Due_Date','Due_Time','Required_Proof_Type','Manager_Email','Active_Status','Created_Date','Created_By','Last_Completed_Date','Next_Due_Date'];
ALLO.HEADERS.Employee_Pending_Report = ['Cycle_ID','Task_ID','Task_Name','Assigned_Employee','Employee_Email','Cycle_Number','Due_Date','Due_Time','Current_Status','Ticket_ID','Completion_Notes','WhatsApp_Update_Reference','Proof_Link','Submitted_By','Completion_Timestamp','Validation_Status'];
ALLO.HEADERS.Completion_Log = ['Completion_ID','Cycle_ID','Task_ID','Task_Name','Employee_Name','Employee_Email','Cycle_Number','Completion_Date','Completion_Timestamp','Ticket_ID','Completion_Notes','Proof_Reference','Validation_Result','Recorded_Timestamp'];
ALLO.HEADERS.Escalation_Log = ['Escalation_ID','Cycle_ID','Task_ID','Employee_Name','Employee_Email','Manager_Email','Alert_Stage','Alert_Type','Alert_Created_Timestamp','Email_Send_Status','Email_Sent_Timestamp','Email_Error','Manager_Acknowledgement_Status','Acknowledged_By','Acknowledgement_Timestamp','Manager_Comments','Leadership_Email','Leadership_Escalation_Status','Leadership_Email_Timestamp','Resolution_Status','Resolution_Timestamp'];
ALLO.HEADERS.Configuration = ['Setting','Value','Description'];
ALLO.HEADERS.Test_Results = ['Test_ID','Test_Name','Execution_Date','Expected_Result','Actual_Result','Pass / Fail','Evidence_Reference','Remarks'];
ALLO.HEADERS.Audit_Log = ['Timestamp','Actor','Action','Detail'];
ALLO.DEFAULTS = {
  'Manager Email':'', 'Leadership Email':'', 'Application Time Zone':'Asia/Kolkata',
  'Daily Reminder Time':'09:00', 'Default Due Time':'17:00', 'Manager Alert Grace Period':'15',
  'Manager Acknowledgement SLA':'240', 'Leadership Escalation SLA':'1440',
  'Working Days':'1,2,3,4,5', 'Holiday Dates':'', 'Email Notification Enabled':'FALSE',
  'Test Mode Enabled':'TRUE', 'Test Email Override':'', 'Dashboard URL':''
};
function onOpen() {
  SpreadsheetApp.getUi().createMenu('ALLO AI OPERATIONS MANAGER')
    .addItem('Initialize System','initializeSystem').addItem('Refresh Pending Tasks','createTaskCycles')
    .addItem('Generate Recurring Cycles','createTaskCycles').addItem('Run Pending Task Check','checkPendingTasks')
    .addItem('Send Test Manager Alert','sendTestManagerAlert').addItem('Run Manager Acknowledgement Test','runManagerAcknowledgementTest')
    .addItem('Run Leadership Escalation Test','runLeadershipEscalationTest').addItem('Run Duplicate Prevention Test','runDuplicatePreventionTest')
    .addItem('Run System Diagnostics','runSystemDiagnostics').addItem('Open Employee Sidebar','showSidebar')
    .addItem('View Configuration','showConfiguration').addToUi();
}
function showSidebar(){SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('UI').setTitle('ALLO Operations'));}
function getSheet_(name) { var s = SpreadsheetApp.getActive().getSheetByName(name); if (!s) throw new Error('Missing sheet: '+name); return s; }
function now_() { return new Date(); }
function tz_() { return getConfig_('Application Time Zone') || Session.getScriptTimeZone() || 'Asia/Kolkata'; }
function getConfig_(key) { var s = SpreadsheetApp.getActive().getSheetByName(ALLO.SHEETS.CONFIG); if (!s) return ALLO.DEFAULTS[key] || ''; var v = s.getRange(1,1,s.getLastRow(),2).getValues(); for (var i=1;i<v.length;i++) if (v[i][0] === key) return String(v[i][1] || ''); return ALLO.DEFAULTS[key] || ''; }
function configBool_(key) { return String(getConfig_(key)).toUpperCase() === 'TRUE'; }
function col_(headers, name) { var i = headers.indexOf(name); if (i < 0) throw new Error('Missing column '+name); return i; }
function rowObject_(headers, row) { var o={}; headers.forEach(function(h,i){o[h]=row[i];}); return o; }
function rows_(sheetName) { var s=getSheet_(sheetName), h=ALLO.HEADERS[sheetName] || s.getRange(1,1,1,s.getLastColumn()).getValues()[0]; return s.getLastRow()<2 ? [] : s.getRange(2,1,s.getLastRow()-1,h.length).getValues().map(function(r){return rowObject_(h,r);}); }
function appendObject_(sheetName, obj) { var h=ALLO.HEADERS[sheetName] || getSheet_(sheetName).getRange(1,1,1,getSheet_(sheetName).getLastColumn()).getValues()[0]; getSheet_(sheetName).appendRow(h.map(function(k){return obj[k] === undefined ? '' : obj[k];})); }
function audit_(action, detail) { appendObject_(ALLO.SHEETS.AUDIT,{Timestamp:now_(),Actor:Session.getActiveUser().getEmail() || 'unverified',Action:action,Detail:detail}); }
