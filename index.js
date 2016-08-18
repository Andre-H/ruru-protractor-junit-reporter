var fs = require('fs');
var path = require('path');
var XMLWriter = require('xml-writer');
var moment = require('moment');

var hasOwnProperty = Object.prototype.hasOwnProperty;

function getBrowserNameFromResult(result){
    return result.description.split('|')[1];
}

function getTestNameFromResult(result){
    return result.description.split('|')[0]
}

function determineTestStatus(run){
    var assertions = run.assertions||[];
    var runDuration = run.duration;
    var assertionsArray = new Array();
    var passed = "";
    var failedAssertions = new Array();
    for (var i = 0; i < assertions.length; i++) {
        assertionsArray.push(assertions[i].passed);
    }
    if (assertionsArray.length > 0) {
        for (var j = 0; j < assertionsArray.length; j++) {
            if (assertionsArray[j] == false) {
                failedAssertions.push("failed");
            }
            if (failedAssertions.length > 0) {
                passed = "false";
            }
            if (failedAssertions.length <= 0) {
                if(runDuration <= 1) {
                    passed = "Skipped";
                }else {
                    passed = "true";
                }
            }
        }
    } else {
        passed = "true";
    }
    return passed;
}

function countFailed(allResults){
    var fail = 0;
    for (var p1 = 0; p1 < allResults.length; p1++) {
        if(allResults[p1] === "false")
            fail++;
    }
    return fail;
}

function XMLReporter(options) {
	var self = this;

	self.generateXMLReport = function (inputFile, title) {
		var jsonResult = require(path.resolve(inputFile));
		var result = generateReport(jsonResult, options.title);
		fs.writeFileSync(path.resolve(options.xmlReportDestPath), result);
	};

	function generateReport(jsonstr, automationHeader) {

		var allResults = new Array();
		var testArray = new Array();
		var totalTime = 0;

		for (var q = 0; q < jsonstr.length; q++) {
			var browserName = getBrowserNameFromResult(jsonstr[q]);
			var testName = getTestNameFromResult(jsonstr[q]);
			var passed = determineTestStatus(jsonstr[q]);
			allResults.push(passed);
			testArray.push({
				testName : testName,
				browser : browserName,
				res : passed,
				duration: jsonstr[q].duration,
				description: jsonstr[q].description,
				assertions: jsonstr[q].assertions
			});
			totalTime += (jsonstr[q].duration / 1000);
		}

		var xw = new XMLWriter(true);
		xw.startDocument();
		xw.startElement('testsuite');

		var failCount = countFailed(allResults);
		if (failCount > 0) {
			xw.writeAttribute('errors', failCount);
			xw.writeAttribute('failures', failCount);
		}
		xw.writeAttribute('tests', jsonstr.length);
		xw.writeAttribute('name', automationHeader);
		xw.writeAttribute('time', totalTime);
		xw.writeAttribute('timestamp', moment().format('YYYY-MM-DDTHH:mm:ss'));//new Date().toISOString());

		for (var t = 0; t < testArray.length; t++) {
			xw.startElement('testcase');
			xw.writeAttribute('className', testArray[t].description);
			xw.writeAttribute('name', testArray[t].description);
			xw.writeAttribute('time', testArray[t].duration / 1000);
			if(allResults[t] != "true") {
				if(allResults[t] == 'Skipped'){
					xw.startElement('skipped');
					xw.writeAttribute('message', 'Skipped reason not provided by Protractor');
				}else {
					xw.startElement('failure');
					xw.writeAttribute('type', 'testfailure');
					for (var jk = 0; jk < testArray[t].assertions.length; jk++) {
						xw.text(testArray[t].assertions[jk].errorMsg + '. ');
						xw.text(testArray[t].assertions[jk].stackTrace + '. ');
					}
				}
				xw.endElement(); //failure
			}
			xw.endElement(); //testcase
		}

		xw.writeElement('system-out', 'beta');
		xw.endElement(); //testsuite
		xw.endDocument();

		return xw.toString();
	}

	return this;
}

module.exports  = XMLReporter;
