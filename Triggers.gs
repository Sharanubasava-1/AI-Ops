function installTimeTriggers(){var handlers=['runDailyAutomation'];ScriptApp.getProjectTriggers().filter(function(t){return handlers.indexOf(t.getHandlerFunction())>=0;}).forEach(function(t){ScriptApp.deleteTrigger(t);});ScriptApp.newTrigger('runDailyAutomation').timeBased().everyHours(1).create();}
function removeTimeTriggers(){ScriptApp.getProjectTriggers().forEach(function(t){ScriptApp.deleteTrigger(t);});}
function sendEmployeeReminders(){return false;}
