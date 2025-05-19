import { Config } from "#components"
import { DB, QBot, Buttons } from "#model"

export default new (class Login {
  async login(e) {
    const qr = await QBot.getlogin(777)
    const data = `https://q.qq.Com/login/applist?code=${qr}`
    const url = Config.QBotSet.markdown ? segment.button([{ text: "登录", link: `${data}` }]) : `\r${data}`
    const msg = [
      `${QBot.title(true)}QQ开放平台管理端登录`,
      `${QBot.quote(true)}登录具有时效性, 请尽快登录`,
      `${QBot.quote(true)}当你选择登录`,
      `${QBot.quote(true)}代表你已经同意将数据托管给${Config.QBotSet.name}Bot`,
      url
    ]
    await e.reply(msg)
    let i = 0
    while (i < 20) {
      let res = await QBot.getqrcode(qr)
      let code = res.code
      if (code == 0) {
        let data = res.data.data
        const cookies = {
          uid: data.uid,
          uin: data.uin,
          ticket: data.ticket,
          developerId: data.developerId,
          appType: data.appType,
          appId: data.appId
        }
        await DB.setcookies(e.user_id, cookies.appId, cookies.uid, cookies.uin, cookies.ticket, cookies.developerId, cookies.appType)

        await redis.set(`QBot:${e.user_id}`, data.appId)
        return await e.reply([`${QBot.title(true)}登录成功`, `${QBot.quote(true)}AppID: ${data.appId}`, new Buttons().QBot()])
      }
      i++
      await QBot.sleep(3000)
    }
    return e.reply(["登录失效", new Buttons().QBot()])
  }
})()
