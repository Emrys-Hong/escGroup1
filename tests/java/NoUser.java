import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.concurrent.TimeUnit;

public class NoUser {
    private WebDriver driver;

    public NoUser(WebDriver driver, String baseURL) {
        this.driver = driver;
        this.driver = new ChromeDriver();
        this.driver.get(baseURL);
        this.driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    }

    public void quitDriver (){
        driver.quit();
        driver = null;
    }

    public String getTitle(){
        return driver.getTitle();
    }
}
