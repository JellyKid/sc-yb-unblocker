SC.event.addGlobalHandler(SC.event.QueryCommandButtons, function (eventArgs) {
	switch (eventArgs.area) {
		case 'HostDetailPanel':
		case 'HostDetailPopoutPanel':
			eventArgs.buttonDefinitions.push({
        commandName: 'UnblockCard',
        className: 'NeverOverFlow',
        text: 'Unblock Card'
      });
			break;
	}
});

SC.event.addGlobalHandler(SC.event.ExecuteCommand, function(eventArgs){

	switch (eventArgs.commandName) {
		case 'UnblockCard':
			SC.util.includeStyleSheet(extensionContext.baseUrl + 'Style.css');

      SC.dialog.showModalButtonDialog('UnblockCard',"Unblock Smart Card","Unblock","Default",
      function(container){


        SC.ui.addElement(container, 'P', 'Please put in admin pin twice to unblock the card');
        var pukInputText = SC.ui.createElement('SPAN', "PIN: ");
        var pukInput = SC.ui.createElement('INPUT', {id: 'puk', type: 'PASSWORD'});

        var pukInputText2 = SC.ui.createElement('SPAN', "PIN: ");
        var pukInput2 = SC.ui.createElement('INPUT', {id: 'puk2', type: 'PASSWORD'});

        var puk = SC.ui.createElement('DIV');

        SC.ui.addContent(puk,pukInputText);
        SC.ui.addContent(puk,pukInput);
        SC.ui.addContent(container,puk);

        var puk2 = SC.ui.createElement('DIV');

        SC.ui.addContent(puk2,pukInputText2);
        SC.ui.addContent(puk2,pukInput2);
        SC.ui.addContent(container,puk2);

        var unblockMessage = SC.ui.createElement('DIV', {id: 'unblockMessage'});
        SC.ui.addContent(container,unblockMessage);

      },
      function(eventArgs) {
				//reset message
				$('unblockMessage').innerHTML = "";
				SC.css.ensureClass($('unblockMessage'), 'unblockError', false);
				if($('puk').value == $('puk2').value){
					//start unblock attempt
					unblockSmartCard($('puk').value,function(err,res){
						if(err){
							SC.css.ensureClass($('unblockMessage'), 'unblockError', true);
							$('unblockMessage').innerHTML = "Error: " + err;
						} else {
							$('unblockMessage').innerHTML = res;
						}
					});
				} else {
					SC.css.ensureClass($('unblockMessage'), 'unblockError', true);
					$('unblockMessage').innerHTML = "Error: PINs do not match!";
				}
      }
    );
	}
});

function unblockSmartCard(puk, cb) {
	var allRows = $('detailTable').rows;
	var commandRows = Array.prototype.filter.call(allRows, function (r) { return SC.ui.isSelected(r); });
	if(commandRows.length > 1){
		return cb("The unblock command can only be run on one computer at a time. Please select only one computer.");
	}
	if(commandRows.length < 1){
		return cb("You must select a computer to unblock.")
	}

	var session = commandRows[0]._dataItem;

	var pathToExe = extensionContext.settingValues["Path to yubico-piv-tool.exe"];
	var pin = extensionContext.settingValues["Default PIN"];

	var command = '"' + pathToExe + '" -a "unblock-pin"' + ' -P ' + puk + ' -N ' + pin + '"';
	// var command = '"' + pathToExe + '" -a "status"';

	SC.service.AddEventToSessions(
		window.getSessionGroupUrlPart()[0],
		[session.SessionID],
		SC.types.SessionEventType.QueuedCommand,
		command,
		function(success){
			$('unblockMessage').innerHTML = "Attempting unblock... please wait"

			getLastCommandData(session, function(err,res){
				if(err){return cb(err)};
				checkUnblockSuccess(res,function(err, res){
					if(err){return cb(err)};
					return cb(null, res);
				})
			});

		},
		function(fail){
			console.error(fail);
			return cb("Failed to send unblock command. Is the session connected?");
		}
	);
}

function getLastCommandData(session,cb) {

	var current = Date.now();

	var checkInt = window.setInterval(function(){
		var sortedEvents = _cache[session.SessionID + 'SortedEvents'] || null;
		if(sortedEvents){
			var lastEvent = sortedEvents.item[sortedEvents.item.length - 1];
			if(lastEvent.eventType === 70){
				window.clearInterval(checkInt);
				cb(null, lastEvent.data);
			}
		}

		var timeout = Date.now() - current;

		if(timeout > 30000){
			window.clearInterval(checkInt);
			cb("Command timed out");
		}
	},2000);
}

function checkUnblockSuccess(output,cb) {
	var success = /Successfully unblocked the pin code./.exec(output);
	if(success){
		return cb(null, success[0] + " The pin is now set to " + extensionContext.settingValues["Default PIN"]);
	} else {
		var err = output.split('\n').splice(2);
		return cb(err.join('<br>'));
	}
}
