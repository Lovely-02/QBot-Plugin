import { Config } from "#components"
import { QBot, Buttons } from "#model"
import moment from "moment"

export class Qdaue extends plugin {
  constructor() {
    super({
      name: "[dau.js]QBotdau",
      dsc: "QQ开放平台",
      event: "message",
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}数据$`,
          fnc: "dau"
        }
      ]
    })
  }

  async dau(e) {
    const appId = await redis.get(`QBot:${e.user_id}`)
    const ck = await QBot.getcookies(e.user_id, appId)
    if (!ck) {
      return await e.reply("你还没有登录哦~\r请输入#QBot登录")
    }
    const data1 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 1)
    const data2 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 2)
    const data3 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 3)
    let code1 = data1.retcode
    let code2 = data2.retcode
    let code3 = data3.retcode
    if (code1 != 0 || code2 != 0 || code3 != 0) {
      return e.reply(["获取数据失败\r可能登录失效了, 请重新登录", new Buttons().QBot()])
    } else {
      let msglist = []
      let msg_data = data1.data.msg_data
      let group_data = data2.data.group_data
      let friend_data = data3.data.friend_data

      function generateDayData(dayIndex) {
        const formattedDate = msg_data[dayIndex]?.report_date
          ? moment(msg_data[dayIndex].report_date, "YYYYMMDD").format("YYYY年M月D日")
          : "无数据"
        return [
          `${formattedDate}`,
          `上行消息：${msg_data[dayIndex]?.up_msg_cnt || "无数据"}`,
          `上行人数：${msg_data[dayIndex]?.up_msg_uv || "无数据"}`,
          `下行消息：${msg_data[dayIndex]?.down_msg_cnt || "无数据"}`,
          `总消息量：${msg_data[dayIndex]?.bot_msg_cnt || "无数据"}`,
          `现有群数：${group_data[dayIndex]?.existing_groups || "无数据"}`,
          `已使用群：${group_data[dayIndex]?.used_groups || "无数据"}`,
          `新增群数：${group_data[dayIndex]?.added_groups || "无数据"}`,
          `减少群数：${group_data[dayIndex]?.removed_groups || "无数据"}`,
          `现有好友：${friend_data[dayIndex]?.stock_added_friends || "无数据"}`,
          `使用好友：${friend_data[dayIndex]?.used_friends || "无数据"}`,
          `新增好友：${friend_data[dayIndex]?.new_added_friends || "无数据"}`,
          `减少好友：${friend_data[dayIndex]?.new_removed_friends || "无数据"}`
        ]
      }
      if (Config.QBotSet.markdown) {
        msglist.push(`\`\`\`\r`)
      }
      for (let i = 0; i < Config.QBotSet.day; i++) {
        msglist.push(generateDayData(i).join("\n"))
      }
      if (Config.QBotSet.markdown) {
        msglist.push("```")
      }
      e.reply([msglist.join("\n——————\n"), new Buttons().QBot()])
    }
  }
}
