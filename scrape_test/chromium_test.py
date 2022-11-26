from selenium import webdriver

options = webdriver.ChromeOptions()
options.binary_location = "/usr/bin/chromium"
# options.add_argument("--no-sandbox")
driver = webdriver.Chrome(
        '/usr/bin/chromedriver',
        options=options
    )
driver.get('https://www.google.com')
print(driver.page_source)