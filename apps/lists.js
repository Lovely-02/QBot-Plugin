import { Config } from "#components"
import { QBot, Buttons } from "#model"

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
    const ck = await QBot.getcookies(e.user_id, appId)
    if (!ck) {
      return await e.reply("你还没有登录哦~\r请输入#QBot登录")
    }
    const data = await QBot.getlists(ck.uin, ck.developerId, ck.ticket)
    if (data.code != 0) {
      return await e.reply("获取列表失败")
    }
    const apps = data.data.apps
    let msglist = []
    const lists = apps.map((app) => {
      return `名称: ${app.app_name}\nID: ${app.app_id}\n描述: ${app.app_desc}`
    })
    if (Config.QBotSet.markdown) {
      msglist.push(`#QBot列表\n\`\`\`\r`)
    } else {
      msglist.push(`QBot列表\r`)
    }
    msglist.push(lists.join("\n——————\n"))
    if (Config.QBotSet.markdown) {
      msglist.push(`\n\`\`\``)
    }
    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
