import static org.junit.jupiter.api.Assertions.assertEquals;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.seleniumhq.jetty9.util.log.Log;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class TestNoUser {
    private static int passedCases = 0;
    private static int failedCases = 0;
    private static int totalCase = 0;
    private final static String USERNAME = System.getenv("ESC_USER_USERNAME");
    private final static String PASSWORD = System.getenv("ESC_USER_PASSWORD");
    private final static String PHONENUMBER = System.getenv("ESC_PHONENUMBER");
    private final static String baseURL = "https://escgroup-1.herokuapp.com";

    private static WebDriver driver;
    private static WebElement navbar;
    private static WebDriverWait wait;

    protected static final String webdriver = "webdriver.chrome.driver";
    protected static final String pathtoDriver = System.getenv("HOME") + "/Documents/selenium-java-3.141.59/chromedriver";

    protected static Map<Integer, String> LogFails;

    public static void main (String[] args) throws Exception{
        LogFails = new LinkedHashMap<>();
        testHomePortal();
        openSignUpPage();
        testShortPasswordPrompt();
        testInvalidCharactersInPassword();
        testInvalidPhoneNumber();
        testInvalidEmail();
        openLoginPage();
        if (failedCases >0)
            System.out.println("~~~~~ Failed Cases ~~~~~");
        for (int i: LogFails.keySet()){
            System.out.println("Test case " + i + ": \n\t" + LogFails.get(i) + "\n\n");
        }

        System.out.println("\n\n~~~~~ SUMMARY ~~~~~");
        System.out.println("Total cases: " + totalCase);
        if (passedCases >0)
            System.out.println("Total passed cases: " + passedCases);
        if (failedCases >0)
            System.out.println("Total failed cases: " + failedCases);
    }
    /************** Helper Methods **************/
    /**
     * Run this each time before each test cases!
     * @throws Exception
     */
    public static void setUp() throws Exception {
        System.setProperty(webdriver,pathtoDriver);
        driver = new ChromeDriver();
        driver.get(baseURL);
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        wait = new WebDriverWait(driver, 10);
    }

    /**
     * Run this each time after each test cases!
     * @throws Exception
     */
    public static void tearDown(){
        driver.quit();
        navbar = null;
    }

    public static String currentMethodName(int index){
        return Thread.currentThread().getStackTrace()[index].getMethodName();
    }

    public static void printSuccessCase(){
        System.out.println("\t" + totalCase + ": " + currentMethodName(3) + " is successful.");
        passedCases++;
    }



    /************** Test Cases **************/
    /**
     * Test case: 1 -- check that the Home page has the correct title.
     * @throws Exception
     */
    public static void testHomePortal() {
        try {
            setUp();
            assertEquals("Accenture's ACNAPI Portal", driver.getTitle(), ++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
            LogFails.put(totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /************** Test Cases **************/
    /**
     * Test case: 2 -- check that the Signup page has the correct title.
     * @throws Exception
     */
    public static void openSignUpPage() {
        try {
            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_signup")).click();
            assertEquals("ACNAPI Register",driver.getTitle(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
            LogFails.put(totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 3 -- Test prompt user to have longer password
     * @throws Exception
     */
    public static void testShortPasswordPrompt() {
        try {
            String err_code = "err_password";

            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_signup")).click();
            driver.findElement(By.name("email")).sendKeys(USERNAME);
            driver.findElement(By.name("firstName")).sendKeys("Balapoopi");
            driver.findElement(By.name("lastName")).sendKeys("Langkawi");
            driver.findElement(By.name("phoneNumber")).sendKeys(PHONENUMBER);
            driver.findElement(By.name("password")).sendKeys("1234567", Keys.ENTER);

            WebElement err = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(err_code)));
            assertEquals("Please ensure that your password has a minimum of 8 characters",driver.findElement(By.id("err_password")).getText(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 4 -- Test prompt user to only have alphanumberics + special characters that are ASCII formatted
     * @throws Exception
     */
    public static void testInvalidCharactersInPassword() {
        try {
            String err_code = "err_password";

            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_signup")).click();
            driver.findElement(By.name("email")).sendKeys(USERNAME);
            driver.findElement(By.name("firstName")).sendKeys("Balapoopi");
            driver.findElement(By.name("lastName")).sendKeys("Langkawi");
            driver.findElement(By.name("phoneNumber")).sendKeys(PHONENUMBER);
            driver.findElement(By.name("password")).sendKeys("1234567我爱你", Keys.ENTER);

            WebElement err = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(err_code)));
            assertEquals("Invalid characters in password, please try another one!",err.getText(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 5 -- Test prompt user to have valid 8 digit phone number
     * @throws Exception
     */
    public static void testInvalidPhoneNumber() {
        try {
            String err_code = "err_phoneNumber";

            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_signup")).click();
            driver.findElement(By.name("email")).sendKeys(USERNAME);
            driver.findElement(By.name("firstName")).sendKeys("Balapoopi");
            driver.findElement(By.name("lastName")).sendKeys("Langkawi");
            driver.findElement(By.name("phoneNumber")).sendKeys("1234567");
            driver.findElement(By.name("password")).sendKeys(PASSWORD, Keys.ENTER);

            WebElement err = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(err_code)));
            assertEquals("Please key in a valid phone number with 8 digits (i.e. 91234567). Omit all special characters and spaces!",err.getText(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 6 -- Test prompt user to have proper email
     * @throws Exception
     */
    public static void testInvalidEmail() {
        try {
            String err_code = "err_email";

            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_signup")).click();
            driver.findElement(By.name("email")).sendKeys("some_invalid_email@192.168.0.1");
            driver.findElement(By.name("firstName")).sendKeys("Balapoopi");
            driver.findElement(By.name("lastName")).sendKeys("Langkawi");
            driver.findElement(By.name("phoneNumber")).sendKeys(PHONENUMBER);
            driver.findElement(By.name("password")).sendKeys(PASSWORD, Keys.ENTER);

            WebElement err = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(err_code)));
            assertEquals("Please use valid email!",err.getText(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 7 -- Open login page
     * @throws Exception
     */
    public static void openLoginPage() {
        try {
            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_login")).click();
            assertEquals("ACNAPI Register",driver.getTitle(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 8 -- Try wrong login credentials
     * @throws Exception
     */
    public static void testWrongLoginCredentials() {
        try {
            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_login")).click();
            driver.findElement(By.name("email")).sendKeys(USERNAME);
            driver.findElement(By.name("password")).sendKeys(PASSWORD + "wrong", Keys.ENTER);
            assertEquals("ACNAPI Login",driver.getTitle(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");     // check that it redirects back to login page
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }

    /**
     * Test case: 9 -- Try visiting different routes and ensuring that the user returns to signup page
     * @throws Exception
     */
    public static void testDifferentRoutesNotLoggedIn() {
        try {
            setUp();
            navbar = driver.findElement(By.className("navbar"));
            navbar.findElement(By.id("btn_login")).click();
            driver.findElement(By.name("email")).sendKeys(USERNAME);
            driver.findElement(By.name("password")).sendKeys(PASSWORD + "wrong", Keys.ENTER);
            assertEquals("ACNAPI Login",driver.getTitle(),++totalCase + ": " + currentMethodName(2) + " is incorrect: \n");     // check that it redirects back to login page
            printSuccessCase();
        } catch (AssertionError e){
//            e.printStackTrace();
            LogFails.put(totalCase, e.toString());
            failedCases += 1;
        } catch (Exception f) {
//            f.printStackTrace();
            LogFails.put(++totalCase, f.toString());
            failedCases += 1;
        } finally {
            tearDown();
        }
    }
}
