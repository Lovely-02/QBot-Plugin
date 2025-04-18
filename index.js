import Version from "./components/Version.js"
import { Plugin_Name as AppName } from "#components"
import { loadApps, logSuccess } from "./lib/load/loadApps.js"

let apps,
  loadeYilesCount = 0,
  loadeYilesCounterr = 0

try {
  const {
    apps: loadedApps,
    loadeYilesCount: count,
    loadeYilesCounterr: counterr
  } = await loadApps({ AppsName: "apps" })

  apps = loadedApps
  loadeYilesCount = count
  loadeYilesCounterr = counterr
  logSuccess(
    `${AppName} v${Version.ver} 载入成功！`,
    `作者：${Version.author}`,
    `共加载了 ${loadeYilesCount} 个插件文件，${loadeYilesCounterr} 个失败`
  )
} catch (error) {
  logger.error(`${AppName}插件加载失败：`, error)
}

export { apps }
