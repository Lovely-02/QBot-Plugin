import { Config } from "#components"
import { DB, Buttons } from "#model"

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
      const data = Bot.pickMember(group, String(e.user_id)).getAvatarUrl(100)
      const url = data.replace(/\/0$/, "/100")
      const msg = [
        segment.image(url),
        `\r#欢迎`,
        segment.at(e.user_id),
        `！您是第${userCount}位使用${Config.QBotSet.name}的用户！`,
        `\r>可以把${Config.QBotSet.name}邀请到任意群使用哦！`
      ]
      await e.reply(msg)
    }
    if (!getGroup) {
      await DB.setID("group", group)
    }
    return false
  }

  async all(e) {
    const UserAll = await this.getall("user")
    const GroupAll = await this.getall("group")
    const msg = `📊 ${Config.QBotSet.name}统计: \r用户: ${UserAll}\r群组: ${GroupAll}`
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
