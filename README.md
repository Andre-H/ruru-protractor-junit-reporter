# ruru-protractor-junit-reporter
A post-processor that will output Protractor test results in JUnit XML format.

Will work with multi-capabilities and sharding spec files, because it will take the json output file from Protractor and create a single JUnit XML file.

Build status: [![Run Status](https://api.shippable.com/projects/57b56157e7eea10f00b76da4/badge?branch=master)](https://app.shippable.com/projects/57b56157e7eea10f00b76da4)

Test coverage: [![Coverage Badge](https://api.shippable.com/projects/57b56157e7eea10f00b76da4/coverageBadge?branch=master)](https://app.shippable.com/projects/57b56157e7eea10f00b76da4)

## Installation
`npm install ruru-protractor-junit-reporter`

## Usage
Place the following in your Protractor configuration file
```javascript
var XMLReporter = require('ruru-protractor-junit-reporter');

exports.config = {

	framework : 'jasmine2',
	
	//You MUST efine the resultJsonOutputFile configuration so it can be post processed
	resultJsonOutputFile : 'my-protractor-e2e-results.json',

	...
	
	//Place a afterLauch function similar to:
	afterLaunch : function (exitCode) {
		return new Promise(function (resolve) {

		    var reporter = new XMLReporter({
                title : 'My Protractor End to End Results',
                xmlReportDestPath : 'reportDestinationFolder/protractor-e2e-report.xml'
            });

			reporter.generateXMLReport(exports.config.resultJsonOutputFile);
		});
	}
}
```

## Development
If you want to build and test this project you will be able to by:
```
npm install
npm test
```