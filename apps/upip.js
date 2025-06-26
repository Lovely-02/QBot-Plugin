import { Config } from "#components"
import { QBot, Login, Buttons } from "#model"

export class Qupip extends plugin {
  constructor() {
    super({
      name: "[upip.js]QBotupip",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}更新ip$`,
          fnc: "upip"
        }
      ]
    })
  }

  async upip(e) {
    if (e.isGrup) return await this.e.reply("当前命令仅支持私聊,请私聊使用")
    const login = await Login.Login(e)
    return this.data(e, login.ck, login.appId)
  }

  async data(e, ck, appId) {
    const qr = await QBot.getlogin(51, appId, ck.uin, ck.developerId, ck.ticket)
    const link = `https://q.qq.Com/qrcode/check?client=qq&code=${qr}&ticket=${ck.ticket}`
    const url = Config.QBotSet.markdown ? segment.button([{ text: "点击授权", link: `${link}` }]) : `\r${link}`
    const msg = [
      `${QBot.title(true)}QQ开放平台管理端授权`,
      `${QBot.quote(true)}授权具有时效性, 请尽快授权`,
      `${QBot.quote(true)}当你选择授权`,
      `${QBot.quote(true)}代表你已经同意将数据托管给${Config.QBotSet.name}Bot`,
      url
    ]
    await e.reply(msg, true, { at: true, recallMsg: 60 })
    let i = 0
    while (i < 20) {
      let res = await QBot.getqrcode(qr)
      let code = res.code
      if (code == 0) {
        let data = res.data.data
        await QBot.updateip(ck.uin, ck.developerId, ck.ticket, appId, await this.getip(), qr)
        return await e.reply([
          `${QBot.title(true)}${res.message}`,
          `${QBot.quote(true)}授权人: ${data.uin}`,
          `${QBot.quote(true)}已设置IP: ${await this.getip()}`,
          new Buttons().QBot()
        ])
      }
      i++
      await QBot.sleep(3000)
    }
    return e.reply(["授权失效", new Buttons().QBot()], true, { at: true, recallMsg: 60 })
  }
  async getip() {
    const ip = await (await fetch("https://4.ipw.cn/")).text()
    return ip.trim()
  }
}
