import { Config } from "#components"
import { QBot, DB, Buttons } from "#model"

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
      return await e.reply("你还没有登录哦~\r请输入#QBot登录")
    }
    const data = await QBot.getlists(ck.uin, ck.developerId, ck.ticket)
    if (data.code != 0) {
      return await e.reply(["获取列表失败\r可能登录失效了, 请重新登录", new Buttons().QBot()])
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
      const datePrefix = Config.QBotSet.markdown ? "##" : ""
      const infoPrefix = Config.QBotSet.markdown ? ">" : ""

      const msg = []
      msg.push(`${datePrefix}名称: ${app.app_name}`)
      msg.push(`${infoPrefix}ID: ${app.app_id} ${statusText}`)
      msg.push(`${infoPrefix}描述: ${app.app_desc}`)
      return msg.join("\r")
    })

    const header = Config.QBotSet.markdown ? `\r#QBot账号列表\r\r` : `QBot账号列表\r`
    let msglist = []
    msglist.push(header)
    msglist.push(lists.join("\r\r---\r"))
    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
