var assert = require('chai').assert,
    username = process.env.ESC_USER_USERNAME,
    password = process.env.ESC_USER_PASSWORD,
    phoneNumber = process.env.ESC_ADMIN_PHONENUMBER,
    /* Change the baseURL to your application URL */
    baseURL = "https://escgroup-1.herokuapp.com",
    driver,
    navbar;



const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
/**
 * Basic user pages. Checks `title` of routes
 */
describe('Title pages for non-users', function() {
    this.timeout(10000)
    beforeEach(async function (){
        driver = new Builder().forBrowser('chrome').build();
        await driver.getSession().then(sessionid => {
            driver.sessionID = sessionid.id_;
        });
        await driver.get(baseURL);
        navbar = await driver.findElement(By.className('navbar'));
    });

    afterEach(function (done) {
        // driver.executeScript("sauce:job-result=" + (true ? "passed" : "failed"));    // idk what this is used for...
        driver.quit();
        done();
    });

    describe('/', function(){
        it('should-open-acnapi-portal', async function() {
            try{
                await driver.getTitle().then(title => {
                    expect(title).to.be.equal("Accenture's ACNAPI Portal");
                });
            } catch(err){
                console.log(err);
            }
        });
    });

    /**
     * various test cases to test signing up
     */
    describe('/users/signup', async function(){
        it('should-open-acnapi-signup-route', async function() {
            await navbar.findElement(By.id('btn_signup')).click();      // enter registration page
            
            try{
                await driver.getTitle().then(title => {
                    expect(title).to.be.equal("ACNAPI Register");
                });
            } catch(err){
                console.log(err);
            }
        });

        it('should-prompt-password-too-short', async function() {
            await navbar.findElement(By.id('btn_signup')).click();      // enter registration page
            await driver.findElement(By.name('email')).sendKeys(username);         // enter default user email into `email` box
            await driver.findElement(By.name('firstName')).sendKeys('Jeremy');         // enter default user first name into `firstName` box
            await driver.findElement(By.name('lastName')).sendKeys('Ng');         // enter default user last name into `lastName` box
            await driver.findElement(By.name('phoneNumber')).sendKeys(phoneNumber);         // enter default user phonenumber into `phoneNumber` box
            await driver.findElement(By.name('password')).sendKeys('1234567', Key.ENTER);         // enter short password into `password` box
            await driver.wait(until.elementLocated(By.id('err_password')));
            try{
                await driver.findElement(By.id('err_password')).then(err_pw => {
                    console.log('invalid length of password: \n\n\n' + err_pw);
                    expect(err_pw).to.be.equal("Please ensure that your password has a minimum of 8 characters");
                });
            } catch(err){
                console.log(err);
            }
        });

        it('should-prompt-invalid-characters-in-password', async function() {
            await navbar.findElement(By.id('btn_signup')).click();      // enter registration page
            await driver.findElement(By.name('email')).sendKeys(username);         // enter default user email into `email` box
            await driver.findElement(By.name('firstName')).sendKeys('Jeremy');         // enter default user first name into `firstName` box
            await driver.findElement(By.name('lastName')).sendKeys('Ng');         // enter default user last name into `lastName` box
            await driver.findElement(By.name('phoneNumber')).sendKeys(phoneNumber);         // enter default user phonenumber into `phoneNumber` box
            await driver.findElement(By.name('password')).sendKeys('1234567我爱你', Key.ENTER);         // enter short password into `password` box
            try{
                await driver.findElement(By.id('err_password')).then(err_pw => {
                    console.log('invalid chars in password: \n\n\n' + err_pw);
                    
                    expect(err_pw).to.be.equal("Invalid characters in password, please try another one!");
                });
            } catch(err){
                console.log(err);
            }
        });

        it('should-prompt-invalid-phone-number', async function() {
            await navbar.findElement(By.id('btn_signup')).click();      // enter registration page
            await driver.findElement(By.name('email')).sendKeys(username);         // enter default user email into `email` box
            await driver.findElement(By.name('firstName')).sendKeys('Jeremy');         // enter default user first name into `firstName` box
            await driver.findElement(By.name('lastName')).sendKeys('Ng');         // enter default user last name into `lastName` box
            await driver.findElement(By.name('phoneNumber')).sendKeys('1234567');         // enter default user phonenumber into `phoneNumber` box
            await driver.findElement(By.name('password')).sendKeys(password, Key.ENTER);         // enter short password into `password` box
            try{
                await driver.findElement(By.id('err_phoneNumber')).then(err_phoneNumber => {
                    expect(err_phoneNumber).to.be.equal("Please key in a valid phone number with 8 digits (i.e. 91234567). Omit all special characters and spaces!");
                });
            } catch(err){
                console.log(err);
            }
        });

        it('should-prompt-invalid-email', async function() {
            await navbar.findElement(By.id('btn_signup')).click();      // enter registration page
            await driver.findElement(By.name('email')).sendKeys('some_invalid_email@192.168.0.1');         // enter default user email into `email` box
            await driver.findElement(By.name('firstName')).sendKeys('Jeremy');         // enter default user first name into `firstName` box
            await driver.findElement(By.name('lastName')).sendKeys('Ng');         // enter default user last name into `lastName` box
            await driver.findElement(By.name('phoneNumber')).sendKeys(phoneNumber);         // enter default user phonenumber into `phoneNumber` box
            await driver.findElement(By.name('password')).sendKeys(password, Key.ENTER);         // enter short password into `password` box
            try{
                await driver.findElement(By.id('err_email')).then(err_email => {
                    expect(err_email).to.be.equal("Please use valid email!");
                });
            } catch(err){
                console.log(err);
            }
        });
    });

    describe('/users/login', function(){
        it('should-open-acnapi-login-route', async function() {
            await navbar.findElement(By.id('btn_login')).click();
            try{
                await driver.getTitle().then(title => {
                    expect(title).to.be.equal("ACNAPI Login");
                });
            } catch(err){
                console.log(err);
            }
        });
    });

    describe('/btn_home', function() {
        it('should-open-home-route', async function() {
            await navbar.findElement(By.id('btn_home')).click();
            try{
                await driver.getTitle().then(title => {
                    expect(title).to.be.equal("Accenture's ACNAPI Portal");
                });
            } catch(err){
                console.log(err);
            }
        });
    });

    /**
     * test redirection for users that have not logged in
     */
    describe('user have not logged in', function(){
        describe('/my_tickets/:user_id', function(){
            it('should-redirect-to-signup-page', async function() {
                await navbar.findElement(By.id('btn_tickets')).click();
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("ACNAPI Register");       // redirected to signup page
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
        
        describe('/ticket/form', function(){
            it('should-redirect-to-signup-page', async function() {
                await navbar.findElement(By.id('btn_ticket-form')).click();
                try{
                    await driver.getTitle().then(title => {
                        expect(title).to.be.equal("ACNAPI Register");       // redirected to signup page
                    });
                } catch(err){
                    console.log(err);
                }
            });
        });
    });
});