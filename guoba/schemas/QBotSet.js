export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "QBot配置"
  },
  {
    field: "QBotSet.name",
    label: "QBot名称",
    required: true,
    componentProps: {
      placeholder: "请输入QBot名称"
    },
    component: "Input"
  },
  {
    field: "QBotSet.markdown",
    label: "markdown模式",
    component: "Switch"
  },
  {
    field: "QBotSet.day",
    label: "dau显示天数",
    required: true,
    componentProps: {
      placeholder: "请输入数字"
    },
    component: "InputNumber"
  },
  {
    field: "QBotSet.count",
    label: "QBot统计",
    component: "Switch"
  }
]
