export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "插件配置"
  },
  {
    field: "admin.priority",
    label: "插件优先级",
    required: true,
    componentProps: {
      placeholder: "请输入数字"
    },
    component: "InputNumber"
  },
  {
    field: "admin.reg",
    label: "正则部分",
    required: true,
    componentProps: {
      placeholder: "请输入正则部分"
    },
    component: "Input"
  }
]
