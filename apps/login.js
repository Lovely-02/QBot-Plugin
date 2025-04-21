import { Config } from "#components"
import { QBot, Buttons } from "#model"
import yaml from "yaml"
import fs from "fs"

const file = `./data/QBot`

export class Qlogin extends plugin {
  constructor() {
    super({
      name: "[login.js]QBot登录",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}登录$`,
          fnc: "login"
        }
      ]
    })
  }

  async login(e) {
    const qr = await QBot.getlogin(777)
    const url = `https://q.qq.Com/login/applist?code=${qr}`
    let a
    let b
    let c
    if (Config.QBotSet.markdown) {
      a = "#"
      b = ">"
      c = segment.button([{ text: "登录", link: `${url}` }])
    } else {
      a = ""
      b = ""
      c = `\r${url}`
    }
    const msg = [
      `\r${a}QQ开放平台管理端登录`,
      `\r${b}`,
      `登录具有时效性, 请尽快登录\r当你选择登录\r代表你已经同意将数据托管给${Config.QBotSet.name}Bot..`,
      c
    ]
    e.reply(msg)
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
        let cookie = {}
        const filePath = `${file}/${e.user_id}.yaml`
        if (fs.existsSync(filePath)) {
          cookie = yaml.parse(fs.readFileSync(filePath, "utf8"))
        }
        cookie[data.appId] = cookies
        if (!fs.existsSync(file)) {
          fs.mkdirSync(file, { recursive: true })
        }
        fs.writeFileSync(filePath, yaml.stringify(cookie), "utf8")
        await redis.set(`QBot:${e.user_id}`, data.appId)
        return await e.reply([`appId: ${data.appId}\r登录成功`, new Buttons().QBot()])
      }
      i++
      await QBot.sleep(3000)
    }
    return e.reply("登录失效")
  }
}
