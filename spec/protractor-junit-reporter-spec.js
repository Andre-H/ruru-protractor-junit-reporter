var fs = require('fs');
require('node-jasmine-file-contents-matcher');

describe('Generate JUnit XML Report', function () {

    var jSonXMLReporter = require('../index.js');
    var baseTime = new Date(2013, 9, 23);
    jasmine.clock().mockDate(baseTime);

    it('should create XML from JSON', function (done) {
        var xmlReporter = new jSonXMLReporter({
            title : 'Protractor End to End Test Results',
            xmlReportDestPath : './target/protractor-e2e-report-basic.xml'
        });
        xmlReporter.generateXMLReport('./resources/protractor-e2e-report-basic.json');
        var temp = fs.readFileSync('./target/protractor-e2e-report-basic.xml');
        //temp = temp.replace('timestamp=".*"','timestamp=""');
        expect(temp).toEqualFileContents('protractor-e2e-report-basic', done);
    });


    it('should be able to handle failed tests from JSON', function (done) {
        var xmlReporter = new jSonXMLReporter({
            title : 'Protractor End to End Test Results',
            xmlReportDestPath : './target/protractor-e2e-report-with-failures.xml'
        });
        xmlReporter.generateXMLReport('./resources/protractor-e2e-report-with-failures.json');
        var temp = fs.readFileSync('./target/protractor-e2e-report-with-failures.xml');
        expect(temp).toEqualFileContents('protractor-e2e-report-with-failures',done);
    });


    it('should treat passed tests with the duration of 0 as skipped', function (done) {
        var xmlReporter = new jSonXMLReporter({
            title : 'Protractor End to End Test Results',
            xmlReportDestPath : './target/protractor-e2e-report-with-skips.xml'
        });
        xmlReporter.generateXMLReport('./resources/protractor-e2e-report-with-skips.json');
        var temp = fs.readFileSync('./target/protractor-e2e-report-with-skips.xml');
        expect(temp).toEqualFileContents('protractor-e2e-report-with-skips',done);
    });

    it('should be able to handle a run without assertions', function (done) {
        var xmlReporter = new jSonXMLReporter({
            title : 'Protractor End to End Test Results',
            xmlReportDestPath : './target/protractor-e2e-report-without-assertion.xml'
        });
        xmlReporter.generateXMLReport('./resources/protractor-e2e-report-without-assertion.json');
        var temp = fs.readFileSync('./target/protractor-e2e-report-without-assertion.xml');
        expect(temp).toEqualFileContents('protractor-e2e-report-without-assertion',done);
    });


});