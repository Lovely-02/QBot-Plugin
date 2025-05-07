import { Config } from "#components"
import { QBot, DB, Buttons } from "#model"
import moment from "moment"

export class Qdau extends plugin {
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
    const ck = await DB.getcookies(e.user_id, appId)
    if (!ck) {
      return await e.reply(["你还没有登录哦~\r请输入#QBot登录", new Buttons().QBot()])
    }
    const data0 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 0)
    const data1 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 1)
    const data2 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 2)
    const data3 = await QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 3)
    let code0 = data0.retcode
    let code1 = data1.retcode
    let code2 = data2.retcode
    let code3 = data3.retcode
    if (code0 != 0 || code1 != 0 || code2 != 0 || code3 != 0) {
      return e.reply(["获取数据失败\r可能登录失效了, 请重新登录", new Buttons().QBot()])
    } else {
      let msglist = []
      let qg_data = data0.data.guild_data
      let msg_data = data1.data.msg_data
      let group_data = data2.data.group_data
      let friend_data = data3.data.friend_data

      const Days = msg_data.length
      const UpUv = msg_data.reduce((sum, dayData) => sum + (dayData?.up_msg_uv || 0), 0)
      const avgUpUv = Days > 0 ? (UpUv / Days).toFixed(2) : 0

      function DayData(dayIndex) {
        const DAUdata = msg_data[dayIndex]?.report_date ? moment(msg_data[dayIndex].report_date, "YYYYMMDD").format("YYYY年M月D日") : "无"
        const dayInfo = [
          `消息统计`,
          `上行：${msg_data[dayIndex]?.up_msg_cnt || "无"} (${msg_data[dayIndex]?.up_msg_uv || "无"}人)`,
          `下行：${msg_data[dayIndex]?.down_msg_cnt || "无"}`,
          `总量：${msg_data[dayIndex]?.bot_msg_cnt || "无"}`,
          `群聊统计`,
          `现有：${group_data[dayIndex]?.existing_groups || "无"} 已用：${group_data[dayIndex]?.used_groups || "无"}`,
          `新增：${group_data[dayIndex]?.added_groups || "无"} 减少：${group_data[dayIndex]?.removed_groups || "无"}`,
          `好友统计`,
          `现有：${friend_data[dayIndex]?.stock_added_friends || "无"} 已用：${friend_data[dayIndex]?.used_friends || "无"}`,
          `新增：${friend_data[dayIndex]?.new_added_friends || "无"} 减少：${friend_data[dayIndex]?.new_removed_friends || "无"}`,
          `频道统计`,
          `现有：${qg_data[dayIndex]?.in_guild_cnt || "无"} 已用：${qg_data[dayIndex]?.used_guild_cnt || "无"}`,
          `新增：${qg_data[dayIndex]?.add_guild_cnt || "无"} 减少：${qg_data[dayIndex]?.removed_guild_cnt || "无"}`
        ]
        const result = [`${QBot.title()}${DAUdata}`, ...dayInfo.map((info) => `${QBot.quote()}${info}`)]
        return result.join("")
      }

      for (let i = 0; i < Config.QBotSet.day; i++) {
        msglist.push(DayData(i))
      }
      const msg = [
        `${QBot.title(true)}QBot数据`,
        `${QBot.quote(true)}最近${Config.QBotSet.day}天统计`,
        `${QBot.json()}`,
        msglist.join(`\r\r---\r`),
        `${QBot.json()}`,
        `${QBot.quote(true)}近${Days}天平均DAU: ${avgUpUv}人`
      ]
      e.reply([msg.join(""), new Buttons().QBot()])
    }
  }
}
