/*
 * 此配置文件为系统使用，请勿修改，否则可能无法正常使用
 * */

export const helpCfg = {
  title: "QBot帮助",
  subTitle: "[QBot插件] Yunzai-Bot&QBot-Plugin",
  colCount: 4,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"]
}

export const helpList = [
  {
    group: "登录类",
    list: [
      {
        icon: 1,
        title: "#Qbot登录",
        desc: "登录开放平台"
      }
    ]
  },
  {
    group: "功能类",
    list: [
      {
        icon: 2,
        title: "#Qbot列表",
        desc: "开放平台列表"
      },
      {
        icon: 3,
        title: "#Qbot通知",
        desc: "开放平台通知"
      },
      {
        icon: 4,
        title: "#Qbot数据",
        desc: "开放平台数据"
      },
      {
        icon: 5,
        title: "#Qbot模板",
        desc: "开放平台模板"
      }
    ]
  }
]

export const isSys = true
