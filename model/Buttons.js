export default class Button {
  QBot() {
    return segment.button(
      [
        { text: "管理登录", callback: `#QBot登录` }
      ],
      [
        { text: "列表", callback: `#QBot列表` },
        { text: "通知", callback: `#QBot通知` },
        { text: "数据", callback: `#QBot数据` }
      ]
    )
  }
}
