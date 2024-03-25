const { Builder, By, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
let option_s = new Options()
let option_m = new Options()

option_s.addArguments(
  `--user-data-dir=/Users/yq/Library/Application Support/Google/Chrome/Default`
)
option_m.addArguments(
  '--user-data-dir=/Users/yq/Library/Application Support/Google/Chrome/Default/Profile 1'
)
// option_s.addArguments('--start-maximized')

// 如果还想隐身模式启动浏览器，这就要使用--incognito启动参数，在driver实例化前给options加上这一条参数即可：
// options.addArguments('--incognito')
let driver

// 主程序
const init = async () => {
  driver = await new Builder()
    .setChromeOptions(option_m)
    .forBrowser('chrome')
    .build()

  await login()
  await vote()
}

const login = async () => {
  let curUrl = ''
  await driver.get(
    'https://snapshot.org/#/0xshuai.eth/proposal/0x5a70cbd28408377e46660a8c6f06274c26f49e6a9fcce9e71c51ade18bfc7548'
  )
  try {
    // 获取网页句柄
    const pageHandle = await driver.getWindowHandle()

    // connect
    // const page_connect = await driver.findElement(
    //   By.xpath('//*[@id="navbar"]/div/div/div/div[2]/button')
    // )
    const page_connect = await driver.findElement(
      By.css('#navbar > div > div > div > div.flex.space-x-2 > button')
    )

    await page_connect.click()

    console.log('---登录成功---')

    await driver.sleep(2000)

    // const btn_metamask = await driver.findElement(By.css('#modal > div > div.shell.relative.overflow-hidden.rounded-none.md\\:rounded-3xl > div.modal-body > div > div > div:nth-child(1) > button'))
    const btn_metamask = await driver.findElement(
      By.xpath('//*[@id="modal"]/div/div[2]/div[2]/div/div/div[1]/button')
    )
    await btn_metamask.click()

    // 截图(返回base64编码的字符串)
    let encodedString = driver.takeScreenshot()
    console.log(encodedString)

    // 等待2秒,以确保登录成功
    await driver.sleep(2000)

    // 获取 metamask 插件句柄
    const allHandle = await driver.getAllWindowHandles()
    const extensionHandle = await allHandle.find(handle => {
      return handle !== pageHandle
    })

    // 切换到 metamask 插件界面
    driver.switchTo().window(extensionHandle)

    await driver.sleep(2000)

    curUrl = await driver.getCurrentUrl()
    console.log('-------当前url------', curUrl)

    if (!curUrl.includes('efefcjckncpldmldacpoaehpbbijhmkg')) {
      // 切换到网页
      driver.switchTo().window(pageHandle)
      return
    }

    // 输入密码
    const btn_passwd = await driver.findElement(By.id('password'))
    btn_passwd.sendKeys('dmwajt1,mt')

    // 点击登录按钮
    const btn_login = await driver.findElement(By.css('button.btn-default'))
    await btn_login.click()

    await driver.sleep(2000)

    curUrl = await driver.getCurrentUrl()
    console.log('-------当前url------', curUrl)

    //  下一步
    const btn_next = await driver.findElement(
      By.xpath('//*[@id="app-content"]/div/div[2]/div/div[3]/div[2]/button[2]')
    )
    await btn_next.click()
    await driver.sleep(1000)

    curUrl = await driver.getCurrentUrl()
    console.log('-------当前url------', curUrl)

    // 连接
    const btn_connect = await driver.findElement(By.css('button.btn-primary'))
    await btn_connect.click()

    curUrl = await driver.getCurrentUrl()
    console.log('-------当前url------', curUrl)

    // MetaMask登录成功
    console.log('MetaMask Logged In Successfully!')

    // 切换到网页
    driver.switchTo().window(pageHandle)

    curUrl = await driver.getCurrentUrl()
    console.log('-------当前url------', curUrl)
  } catch (err) {
    console.error(err)
    console.log('---登录失败---')
  }
}

const vote = async () => {
  await driver.sleep(2000)

  // 输入密码
  const btn_option1 = await driver.findElement(
    By.css(
      '#content-left > div.space-y-4 > div > div.p-4.leading-5.sm:leading-6 > div > div > button:nth-child(1)'
    )
  )
  await btn_option1.click()

  const btn_vote = await driver.findElement(
    By.css(
      '#content-left > div.space-y-4 > div > div.p-4.leading-5.sm:leading-6 > button'
    )
  )
  await btn_vote.click()

  const btn_confirm = await driver.findElement(
    By.css(
      '#modal > div > div.shell.relative.overflow-hidden.rounded-none.md:rounded-3xl > div.border-t.p-4.text-center > div.float-left.w-2/4.pl-2 > button'
    )
  )
  await btn_confirm.click()
}

exports.init = init
