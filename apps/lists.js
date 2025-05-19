import { Config } from "#components"
import { DB, QBot, Login, Buttons } from "#model"

export class Qlists extends plugin {
  constructor() {
    super({
      name: "[lists.js]QBot列表",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}列表$`,
          fnc: "lists"
        }
      ]
    })
  }

  async lists(e) {
    const appId = await redis.get(`QBot:${e.user_id}`)
    const ck = await DB.getcookies(e.user_id, appId)
    if (!ck) {
      return await Login.login(e)
    }
    const data = await QBot.getlists(ck.uin, ck.developerId, ck.ticket)
    if (data.code != 0) {
      return await Login.login(e)
    }
    const apps = data.data.apps

    const lists = apps.map((app) => {
      let statusText
      switch (app.bot_status) {
        case 2:
          statusText = "审核中"
          break
        case 3:
          statusText = "审核通过"
          break
        case 6:
          statusText = "已发布"
          break
        default:
          statusText = `未知状态(${app.bot_status})`
      }

      const msg = [
        `${QBot.title()}名称: ${app.app_name}`,
        `${QBot.quote()}ID: ${app.app_id} ${statusText}`,
        `${QBot.quote()}描述: ${app.app_desc}`
      ]
      return msg.join("")
    })

    let msglist = [
      `${QBot.title(true)}QBot账号列表\r`,
      `${QBot.json()}`,
      lists.join("\r\r---\r"),
      `${QBot.json()}`
    ]
    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
