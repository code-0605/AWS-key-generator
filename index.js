const puppeteer = require("puppeteer");
const user = "example@gmail.com";
const pass = "password";

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://console.aws.amazon.com/iamv2/home?#/security_credentials"
  );
  await page.setViewport({ width: 1080, height: 1920 });

  const email = {
    input: ".aws-signin-textfield",
    button: "#next_button",
  };

  const password = {
    input: "#password",
    button: "#signin_button",
  };

  // fill email
  await page.waitForSelector(email.input);
  await page.type(email.input, user);

  // click next
  await page.waitForSelector(email.button);
  await page.click(email.button);
  await page.waitForNetworkIdle();
  // fill password
  await page.waitForSelector(password.input);
  await page.type(password.input, pass);

  // click next
  await page.waitForSelector(password.button);
  await page.click(password.button);

  const menu = {
    dropdown: '[aria-controls="menu--account"]',
    link: '[data-testid="aws-security-credentials"]',
  };

  await page.waitForSelector(menu.dropdown);
  await page.click(menu.dropdown);

  await page.waitForSelector(menu.link);
  await page.click(menu.link);

  const accessKey = {
    button: 'button[data-testid="create-access-key"]',
    checkbox: "#ack-risk",
    submit: "button.awsui_primary-button_1xupv_1yj7o_391",
  };

  await page.waitForSelector(accessKey.button);
  await page.click(accessKey.button);

  await page.waitForSelector(accessKey.checkbox);
  await page.click(accessKey.checkbox);

  await page.waitForSelector(accessKey.submit);
  await page.click(accessKey.submit);

  const getKeys = {
    table: "table tbody tr td",
    accessKey: "table tbody tr td:nth-child(1)",
    secretKey: "table tbody tr td:nth-child(2)",
    showSecret: '[data-testid="show-password"]',
  };

  await delay(500);

  await page.waitForSelector(getKeys.showSecret);
  await page.click(getKeys.showSecret);

  await page.waitForSelector(getKeys.table);
  const keys = await page.evaluate((getKeys) => {
    const keys = {};
    keys.accessKey = document.querySelector(getKeys.accessKey)?.textContent;
    keys.secretKey = document
      .querySelector(getKeys.secretKey)
      ?.textContent.endsWith("Hide")
      ? document.querySelector(getKeys.secretKey)?.textContent.slice(0, -4)
      : document.querySelector(getKeys.secretKey)?.textContent;
    return keys;
  }, getKeys);

  console.log(keys);

  await browser.close();
})();
