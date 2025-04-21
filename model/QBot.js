import fs from "fs"
import yaml from "yaml"

export default new (class QBot {
  constructor() {
    this.api = "https://q.qq.com"
    this.bot = `https://bot.q.qq.com`
    this.login = `${this.api}/qrcode/create`
    this.qr = `${this.api}/qrcode/get`
    this.info = `${this.api}/pb/GetDeveloper`
    this.notice = `${this.api}/pb/AppFetchPrivateMsg`
    this.lists = `${this.api}/homepagepb/GetAppListForLogin`
    this.dau = `${this.bot}/cgi-bin/datareport/read`
    this.msg_tpl = `${this.bot}/cgi-bin/msg_tpl/list`
  }

  async getlogin(type, appId = null) {
    const json = await fetch(this.login, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ type: type, miniAppId: appId })
    })
    const data = await json.json()
    const QrCode = data.data.QrCode
    return QrCode
  }

  async getqrcode(qrcode) {
    const json = await fetch(this.qr, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ qrcode: qrcode })
    })
    const data = await json.json()
    return data
  }

  async getinfo(uin, uid, ticket) {
    const json = await fetch(this.info, {
      method: "GET",
      headers: this.getHeaders(uin, uid, ticket)
    })
    const data = await json.json()
    return data
  }

  async getnotice(uin, uid, ticket) {
    const json = await fetch(this.notice, {
      method: "POST",
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ page_num: 0, page_size: 10, receiver: uid, appType: 2 })
    })
    const data = await json.json()
    return data
  }

  async getlists(uin, uid, ticket) {
    const json = await fetch(this.lists, {
      method: "POST",
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ uin: uin, developer_id: uid, ticket: ticket, app_type: [2] })
    })
    const data = await json.json()
    return data
  }

  async getdau(uin, uid, ticket, appid, type) {
    const json = await fetch(`${this.dau}?bot_appid=${appid}&data_type=${type}`, {
      method: "GET",
      headers: this.getHeaders(uin, uid, ticket)
    })
    const data = await json.json()
    return data
  }

  async getmsg_tpl(uin, uid, ticket, appid) {
    const json = await fetch(this.msg_tpl, {
      method: "POST",
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ bot_appid: appid, limit: 30 })
    })
    const data = await json.json()
    return data
  }

  async getcookies(user, appid) {
    const user_id = `./data/QBot/${user}.yaml`
    if (fs.existsSync(user_id)) {
      const ck = yaml.parse(fs.readFileSync(user_id, "utf8"))
      return ck[appid]
    } else {
      return null
    }
  }

  getHeaders(uin = null, uid = null, ticket = null) {
    const headers = {
      "User-Agent": "request",
      "Content-Type": "application/json",
      Cookie: `quin=${uin};quid=${uid};qticket=${ticket}`
    }
    return headers
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
})()
