import { Config } from "#components"
import { QBot, Buttons } from "#model"

export class Qmsg_tpl extends plugin {
  constructor() {
    super({
      name: "[msg_tpl.js]QBot模板",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}(消息)?模板(列表)?$`,
          fnc: "msg_tpl"
        }
      ]
    })
  }
  async msg_tpl(e) {
    const appId = await redis.get(`QBot:${e.user_id}`)
    const ck = await QBot.getcookies(e.user_id, appId)
    if (!ck) {
      return await e.reply("你还没有登录哦~\r请输入#QBot登录")
    }
    const data = await QBot.getmsg_tpl(ck.uin, ck.developerId, ck.ticket, appId)
    if (data.retcode != 0) {
      return await e.reply(["获取模板失败\r可能登录失效了, 请重新登录", new Buttons().QBot()])
    }
    const msg_tpl = data.data.list
    if (msg_tpl.length === 0) {
      return await e.reply("暂无模板消息。")
    }

    let msglist = []
    const templates = msg_tpl.map((tpl) => {
      const typeText =
        tpl.tpl_type === 1
          ? "消息按钮组件"
          : tpl.tpl_type === 2
          ? "Markdown模板组件"
          : `未知类型(${tpl.tpl_type})`
      const statusText =
        tpl.status === 1
          ? "未提审"
          : tpl.status === 2
          ? "审核中"
          : tpl.status === 3
          ? "已通过"
          : `未知状态(${tpl.status})`
      let templateInfo = [
        `ID: ${tpl.tpl_id}`,
        `名称: ${tpl.tpl_name}`,
        `类型: ${typeText}`,
        `状态: ${statusText}`
      ]

      if (Config.QBotSet.markdown) {
        templateInfo.push(`\n\`\`\`\r${tpl.text}\r\`\`\`\n`)
      }

      return templateInfo.join("\n")
    })

    if (Config.QBotSet.markdown) {
      msglist.push(`#QBot消息模板列表\r>`)
      msglist.push(templates.join("\n——————\r\r>"))
    } else {
      msglist.push(`QBot消息模板列表\r`)
      msglist.push(templates.join("\n——————\n"))
    }
    return await e.reply([msglist.join(""), new Buttons().QBot()])
  }
}
