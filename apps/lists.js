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
    const login = await Login.Login(e)
    return this.data(e, login.ck, login.appId)
  }

  async data(e, ck, appId) {
    const data = await QBot.getlists(ck.uin, ck.developerId, ck.ticket)
    const apps = data.data.apps

    const statusMap = {
      2: "审核中",
      3: "审核通过",
      6: "已发布"
    }

    const lists = apps.map((app) => {
      const statusText = statusMap[app.bot_status] || `未知状态(${app.bot_status})`
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
