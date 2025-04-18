import { Config } from "#components"
import admin from "./admin.js"
import QBotSet from "./QBotSet.js"
export const schemas = [admin, QBotSet].flat()

export function getConfigData() {
  const configKeys = ["admin", "QBotSet"]
  return configKeys.reduce((acc, key) => {
    acc[key] = Config[key]
    return acc
  }, {})
}

export async function setConfigData(data, { Result }) {
  for (let key in data) Config.modify(...key.split("."), data[key])
  return Result.ok({}, "Ciallo～(∠・ω< )⌒☆")
}
