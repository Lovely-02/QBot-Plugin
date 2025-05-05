import { Config } from "#components"
import { QBot, DB, Buttons } from "#model"
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
    const ck = await DB.getcookies(e.user_id, appId)
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
    const datePrefix = Config.QBotSet.markdown ? "#" : ""
    const infoPrefix = Config.QBotSet.markdown ? ">" : ""

    const notices = notice.map((msgs, index) => {
      const msg = []
      msg.push(`${datePrefix}通知: ${index + 1}`)
      msg.push(`${infoPrefix}标题: ${msgs.title.replace(/<[^>]*>?/gm, "")}`)
      msg.push(`${infoPrefix}时间: ${moment(parseInt(msgs.send_time) * 1000).format("YYYY年MM月DD日HH:mm")}`)
      return msg.join("\r")
    })

    const header = Config.QBotSet.markdown ? `\r#QBot通知\r\r` : `QBot通知\r`
    let msglist = []
    msglist.push(header)
    msglist.push(notices.join("\r\r---\r"))

    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
