// Tests/DefaultTest.js

var assert = require('assert');

const {Builder, By, until} = require('selenium-webdriver');

(async function example() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.google.com');
        await driver.findElement(By.name('q')).sendKeys('nehalist');    // input into Google Input Box
        await driver.findElement(By.id('tsf')).submit();            // POST submission
        await driver.wait(until.elementLocated(By.id('search')));       
        await driver.findElement(By.partialLinkText('nehalist.io')).click();        // use partialLinkText because the HTML/CSS scripting might have line breaks that will affect what they search for!
        await driver.wait(until.titleIs('nehalist.io'));
        await driver.getTitle().then(function(title){
        console.log(title);
            
        assert.equal(title, 'nehalist.io');
        });
    } finally {
        await driver.quit();
    }
})();