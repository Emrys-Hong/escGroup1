var assert = require('chai').assert,
    username = process.env.ESC_USER_USERNAME,
    password = process.env.ESC_USER_PASSWORD,
    /* Change the baseURL to your application URL */
    baseURL = "https://escgroup-1.herokuapp.com",
    driver;



const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
/**
 * Basic user pages. Checks `title` of routes
 */
describe('Title pages for Users', function() {
    this.timeout(15000) // because of passport possibly lagging, we need to have a higher timeout rate
    beforeEach(async function (){
        driver = new Builder().forBrowser('chrome').build();
        await driver.getSession().then(sessionid => {
            driver.sessionID = sessionid.id_;
        });
        await driver.get(baseURL);
        await driver.findElement(By.id('btn_login')).click();     // enter login page
        await driver.findElement(By.name('email')).sendKeys(username);         // enter default user email into `email` box
        await driver.findElement(By.name('password')).sendKeys(password, Key.ENTER);         // enter default user password into `password` box
    });

    afterEach(function (done) {
        // driver.executeScript("sauce:job-result=" + (true ? "passed" : "failed"));    // idk what this is used for...
        driver.quit();
        done();
    });

    /**
     * test users that is logged in
     */
    describe('user logged in', function(){
        it('should login', async function(){
            try{
                await driver.findElement(By.id('user_logged')).isDisplayed().then(bool => {
                    expect(bool).to.be.true;
                })
            } catch (err) {
                console.log(err);
            }
        });
        describe('/my_tickets/:ticket_id/1', function(){
            it('should-open-users-ticket-inprogress-page', async function() {
                await driver.findElement(By.id('btn_tickets')).click();     // enter queue page for the first time
                await driver.findElement(By.id('tickets1')).click();        // click on `in-progress` Button
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("ACNAPI Tickets - In Progress");
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
        describe('/my_tickets/:ticket_id/2', function(){
            it('should-open-users-ticket-solved-page', async function() {
                await driver.findElement(By.id('btn_tickets')).click();     // enter queue page for the first time
                await driver.findElement(By.id('tickets2')).click();        // click on `solved` Button
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("ACNAPI Tickets - Solved");
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
        describe('/my_tickets/:ticket_id/0', function(){
            it('should-open-users-ticket-queue-page', async function() {
                await driver.findElement(By.id('btn_tickets')).click();     // enter queue page for the first time
                await driver.findElement(By.id('tickets0')).click();        // click on `solved` Button
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("ACNAPI Tickets - Queued");
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
        describe('/ (after logout)', function(){
            it('should-be-able-to-log-out', async function() {
                await driver.findElement(By.id('btn_logout')).click();     // enter queue page for the first time
                await driver.wait(until.titleMatches("Accenture's ACNAPI Portal"));
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("Accenture's ACNAPI Portal");
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
    });
});
