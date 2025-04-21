import { Config } from "#components"
import { QBot, Buttons } from "#model"
import moment from "moment"

export class Qnotice extends plugin {
  constructor() {
    super({
      name: "[notice.js]QBot通知",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}通知$`,
          fnc: "notice"
        }
      ]
    })
  }

  async notice(e) {
    const appId = await redis.get(`QBot:${e.user_id}`)
    const ck = await QBot.getcookies(e.user_id, appId)
    if (!ck) {
      return await e.reply("你还没有登录哦~\r请输入#QBot登录")
    }
    const data = await QBot.getnotice(ck.uin, ck.developerId, ck.ticket)
    if (data.code != 0) {
      return await e.reply(["获取通知失败\r可能登录失效了, 请重新登录", new Buttons().QBot()])
    }

    const notice = data.data.privateMsgs
    if (notice.length === 0) {
      return await e.reply("暂无通知消息。")
    }
    let msglist = []
    const notices = notice.map((msg, index) => {
      return [
        `通知:  ${index + 1}`,
        `标题: ${msg.title.replace(/<[^>]*>?/gm, "")}`,
        `时间: ${moment(parseInt(msg.send_time) * 1000).format("YYYY年MM月DD日HH:mm")}`
      ].join("\n")
    })
    if (Config.QBotSet.markdown) {
      msglist.push(`\r#QBot通知\r\r\`\`\`\r`)
    } else {
      msglist.push(`QBot通知\r`)
    }
    msglist.push(notices.join("\n——————\n"))
    if (Config.QBotSet.markdown) {
      msglist.push(`\n\`\`\``)
    }
    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
