// Load dependencies
var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    baseURL= "http://the-internet.herokuapp.com",
    driver;

// Our test
describe('Test', function(){
    // Set timeout to 10 seconds
    this.timeout(10000);

    //Get driver
    /* Firefox */
    // var driver = new webdriver.Builder().withCapabilities(
    //     webdriver.Capabilities.firefox()
    // ).build();

    /* Edge */
    // var driver = new webdriver.Builder().withCapabilities(
    //     webdriver.Capabilities.edge()
    // ).build();

    /* Internet Explorer */
    // var driver = new webdriver.Builder().withCapabilities(
    //     webdriver.Capabilities.ie()
    // ).build();

    beforeEach(function(done){
        var testName = this.currentTest.title;
        /* Chrome */
        driver = new webdriver.Builder().withCapabilities({
            'browserName': 'chrome',
            'platform': 'Windows 10',
            'version': '73.0',
            'build': 'Onboarding Sample App - NodeJS',
            'name': '4-best-practices',
            /* As a best practice, set important test metadata and execution options
            such as build info, tags for reporting, and timeout durations.
            */
            'maxDuration': 3600,
            'idleTimeout': 1000
        }).build();

        driver.getSession().then(function (sessionid) {
            driver.sessionID = sessionid.id_;
        });
        done();
    })

    afterEach(function (done) {
        driver.executeScript("job-result=" + (true ? "passed" : "failed"));
        driver.quit();
        done();
    });

    it('should-open-chrome', function (done) {
        driver.get(baseURL);
        driver.getTitle().then(function (title) {
            console.log("title is: " + title);
            assert(true);
            done();
        });
    });
})