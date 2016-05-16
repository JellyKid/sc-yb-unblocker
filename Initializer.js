/*
http://forum.screenconnect.com/yaf_postsm33047_Extension--Command-Toolbox.aspx#post33047
multi line saved commands
*/
SC.util.includeStyleSheet(extensionContext.baseUrl + 'Style.css');

SC.event.addGlobalHandler(SC.event.QueryCommandButtons, function (eventArgs) {
	switch (eventArgs.area) {
		case 'HostDetailPopoutPanel':
			//if (window.isCommandEnabled("RunCommand", null, [eventArgs.session], eventArgs.session.Permissions))
				eventArgs.buttonDefinitions.push(
					{commandName: 'Select', commandArgument: 'OpenCommandToolbox', text: SC.res['CommandToolbox.DetailPopout.Modal']}
				);
			break;
	}
});

SC.event.addGlobalHandler(SC.event.ExecuteCommand, function (eventArgs){
	switch (eventArgs.commandArgument) {
		case 'OpenCommandToolbox':
				SC.dialog.showModalButtonDialog('CommandToolbox', SC.res['CommandToolbox.Modal.Title'], SC.res['CommandToolbox.Modal.RunCommand'], 'Default',
				function(container){
					SC.ui.addElement(container, 'P', SC.res['CommandToolbox.Modal.Instruction']);
					var selector = SC.ui.createElement('SELECT', {id: 'commandSelector'});
					var commandText = SC.ui.createElement('TextArea', {id: 'commandText'});
					var commands = getCommandNamesAndValues();

					var saveCommand = SC.ui.createElement('INPUT', {id: 'saveCommand', type: 'BUTTON', value: SC.res['CommandToolbox.Modal.SaveButton']});
					var saveStatusField = SC.ui.createElement('SPAN', {id: 'saveStatus'});

					Array.prototype.forEach.call(commands, function(c){
						var option = document.createElement('option');
						option.value = c.value.toString();
						option.text = c.name;
						selector.appendChild(option);
					});

					selector.onchange = function () {
						commandText.value = getSelectedItemText();
					};

					commandText.value = commands[0].value;

					SC.ui.addContent(container, selector);
					SC.ui.addContent(container, commandText);

					SC.ui.addContent(container, saveCommand);
					SC.ui.addContent(container, saveStatusField);

					saveCommand.onclick =  function() {
						$('saveStatus').innerHTML = SC.res['CommandToolbox.Modal.Saving'];
						var position = $('commandSelector').selectedIndex + 1;
						var commandName = $('commandSelector').options[$('commandSelector').selectedIndex].text;
						SC.service.SaveExtensionCommandSetting(commandName, position, commandText.value, function(ret) {
							$('saveStatus').innerHTML = SC.res['CommandToolbox.Modal.Saved'];
							$('saveStatus').className = 'Success';
						});
					};
				},
				function (eventArgs) {
					var allRows = $('detailTable').rows;
					var commandRows = Array.prototype.filter.call(allRows, function (r) { return SC.ui.isSelected(r); });
					var sessions = Array.prototype.map.call(commandRows, function (r) {return r._dataItem; });
					var sessionIDs = Array.prototype.map.call(sessions, function (s) { return s.SessionID; });

					var chosenCommand = $('commandText').value;

					//window.getSessionGroupUrlPart()[0] different from <5.3
					window.addEventToSessions(window.getSessionGroupUrlPart()[0],
						SC.types.SessionType.Access,
						sessionIDs,
						SC.types.SessionEventType.QueuedCommand,
						null,
						chosenCommand,
						false,
						false,
						true
					);
					SC.dialog.hideModalDialog();
				});
			break;
	}
});

function getSelectedItemText() {
	return $('commandSelector').options[$('commandSelector').selectedIndex].value;
}

function getCommandNamesAndValues() {
	var commandsToReturn = [];
	var commands = [
		{'name' : extensionContext.settingValues.CommandName1, 'value' : extensionContext.settingValues.Command1},
		{'name' : extensionContext.settingValues.CommandName2, 'value' : extensionContext.settingValues.Command2},
		{'name' : extensionContext.settingValues.CommandName3, 'value' : extensionContext.settingValues.Command3},
		{'name' : extensionContext.settingValues.CommandName4, 'value' : extensionContext.settingValues.Command4},
		{'name' : extensionContext.settingValues.CommandName5, 'value' : extensionContext.settingValues.Command5},
		{'name' : extensionContext.settingValues.CommandName6, 'value' : extensionContext.settingValues.Command6},
		{'name' : extensionContext.settingValues.CommandName7, 'value' : extensionContext.settingValues.Command7},
		{'name' : extensionContext.settingValues.CommandName8, 'value' : extensionContext.settingValues.Command8},
		{'name' : extensionContext.settingValues.CommandName9, 'value' : extensionContext.settingValues.Command9},
		{'name' : extensionContext.settingValues.CommandName10, 'value' : extensionContext.settingValues.Command10}
	];
	Array.prototype.forEach.call(commands, function(c) {
		if (c.value !== ''){
			commandsToReturn.push(c);
		}
	});

	return commandsToReturn;
}
