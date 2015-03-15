var fConsole = {};

$(document).ready(function() {
	var ERROR = "error";
	var INFO = "info";
	var VERBOSE = "verbose";
	var timeoutVar;

	fConsole.options = {
		messageShowTime: 5000,
		showMessageInConsole: true,
		loggedLevels: [INFO, ERROR]
	}

	fConsole.logEntries = {}

	function showMessage(message) {
/*        $(".fancyConsole").each(function() {
           $(this).animate({top: (50 + parseInt($(this).css('top')))}, 100); 
           hideMessage($(this));
        });*/
		$("body").append(message.fadeIn(200));

		message.mouseover(function() {
			clearTimeout(timeoutVar);
		})

		message.mouseout(function() {
			clearTimeout(timeoutVar);
			timeoutVar = setTimeout(function() {
				hideMessage(message);
			}, (fConsole.options.messageShowTime) );
		})

		timeoutVar = setTimeout(function() {
			hideMessage(message);
		}, (fConsole.options.messageShowTime) );
	}

	function hideMessage(message) {
		message.fadeOut(400, function() {
			message.remove();
		});
	}

	function realConsoleLog(message) {
		if (fConsole.options.showMessageInConsole) {
			return console.log(message);
		}
	}

	function countMessage(message) {
		if (fConsole.logEntries[message]) {
			fConsole.logEntries[message] = fConsole.logEntries[message] + 1;
		} else {
			fConsole.logEntries[message] = 1;
		}
		return fConsole.logEntries[message];
	}

	function buildMessage(message, logLevel, count) {
		return $("<div class=\"fancyConsole fc_" + logLevel + "\">" + message + (count > 0 ? "<span class=\"small\">" + count + "</span>": "") + "</div>");
	}

	function showMessageWithCount(message, logLevel) {
		var count = countMessage(message);
		if ($.inArray(logLevel, fConsole.options.loggedLevels) >= 0) {
			var messageBox = buildMessage(message, logLevel, count)
			showMessage(messageBox);
			realConsoleLog("fc_log: " + message);
		}
	}

	function showMessageWithoutCount(message, logLevel) {
		var messageBox = buildMessage(message, logLevel, 0)
		showMessage(messageBox);
	}

	fConsole.verbose = function(message) {
		showMessageWithCount(message, VERBOSE);
	}

	fConsole.log = function(message) {
		showMessageWithCount(message, INFO);
	}

	fConsole.error = function(message) {
		showMessageWithCount(message, ERROR);
	}

	fConsole.inform = function(message) {
		showMessageWithoutCount(message, INFO);
	}
});