import { Data, Version, Plugin_Name } from "#components"
import fs from "node:fs"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"

const _path = process.cwd()

/**
 * 渲染HTML
 * @param {string} path 文件路径
 * @param {object} params 参数
 * @param {object} cfg
 */
export default async function (path, params, cfg) {
  let [app, tpl] = path.split("/")
  let resPath = `../../../../../plugins/${Plugin_Name}/resources/`
  Data.createDir(`data/html/${Plugin_Name}/${app}/${tpl}`, "root")
  let data = {
    ...params,
    _plugin: Plugin_Name,
    saveId: params.saveId || params.save_id || tpl,
    tplFile: `./plugins/${Plugin_Name}/resources/${app}/${tpl}.html`,
    pluResPath: resPath,
    _res_path: resPath,
    pageGotoParams: {
      waitUntil: "networkidle0"
    },
    sys: {
      scale: `style=transform:scale(${cfg.scale || 1})`,
      copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & ${Plugin_Name}<span class="version">${Version.ver}</span> & @02`
    },
    quality: 100
  }
  if (process.argv.includes("web-debug")) {
    // debug下保存当前页面的渲染数据，方便模板编写与调试
    // 由于只用于调试，开发者只关注自己当时开发的文件即可，暂不考虑app及plugin的命名冲突
    let saveDir = _path + "/data/ViewData/"
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir)
    }
    let file = saveDir + tpl + ".json"
    data._app = app
    fs.writeFileSync(file, JSON.stringify(data))
  }
  return await puppeteer.screenshot(`${Plugin_Name}/${app}/${tpl}`, data)
}
