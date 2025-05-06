import { Config } from "#components"
import { DB } from "#model"

export class Qcount extends plugin {
  constructor() {
    super({
      name: "[count.js]QBotcount",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}(用户|群聊)?统计$`,
          fnc: "all"
        }
      ]
    })
  }

  async accept(e) {
    if (!Config.QBotSet.count || !this.isQQBot(e)) return false
    const user = String(e.user_id).slice(-32) || String(e.user_id)
    const group = String(e.group_id).slice(-32) || String(e.group_id)
    const getUser = await DB.getID("user", user)
    const getGroup = await DB.getID("group", group)
    if (!getUser) {
      await DB.setID("user", user)
      const userCount = await this.getall("user")
      await e.reply([
        `欢迎新用户！您是第 ${userCount} 位使用 ${Config.QBotSet.name} BOT的用户！`,
        new Buttons().QBot()
      ])
    }
    if (!getGroup) {
      await DB.setID("group", group)
    }
    return false
  }

  async all(e) {
    if (!Config.QBotSet.count || !this.isQQBot(e)) return false
    const UserAll = await this.getall("user")
    const GroupAll = await this.getall("group")
    const msg = `${Config.QBotSet.name}\r📊 当前统计结果: \r用户总数: ${UserAll} 条\r群组总数: ${GroupAll} 条`
    await e.reply([msg, new Buttons().QBot()])
  }

  async getall(type) {
    const data = await DB.allID(type)
    return data.length
  }

  isQQBot(e) {
    return (e.bot?.adapter?.name || e.platform || "未知") === "QQBot"
  }
}
