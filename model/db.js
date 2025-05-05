import fs from "fs"
import path from "path"
import sqlite3 from "sqlite3"

const dbPath = "./data/QBot/data.db"
fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cookies (
      user_id INTEGER NOT NULL,
      appId TEXT NOT NULL,
      uid TEXT NOT NULL,
      uin TEXT NOT NULL,
      ticket TEXT NOT NULL,
      developerId TEXT NOT NULL,
      appType TEXT NOT NULL,
      PRIMARY KEY (user_id, appId)
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS UserID (
      user_id TEXT PRIMARY KEY
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS GroupID (
      group_id TEXT PRIMARY KEY
    )
  `)
})

export default new (class DB {
  async setcookies(...params) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO cookies 
             (user_id, appId, uid, uin, ticket, developerId, appType)
             VALUES (?,?,?,?,?,?,?)`,
        params,
        (err) => (err ? reject(err) : resolve())
      )
    })
  }

  async getcookies(user, appid) {
    return new Promise((resolve) => {
      db.get(
        `SELECT uid, uin, ticket, developerId, appType, appId 
         FROM cookies WHERE user_id=? AND appId=?`,
        [user, appid],
        (err, row) => resolve(err ? null : row)
      )
    })
  }

  async setID(type, id) {
    const table = type === "user" ? "UserID" : "GroupID"
    return new Promise((resolve, reject) => {
      db.run(`INSERT OR IGNORE INTO ${table} (${type}_id) VALUES (?)`, [String(id)], (err) =>
        err ? reject(err) : resolve()
      )
    })
  }

  async getID(type, id) {
    const table = type === "user" ? "UserID" : "GroupID"
    return new Promise((resolve) => {
      db.get(`SELECT ${type}_id FROM ${table} WHERE ${type}_id=?`, [String(id)], (err, row) =>
        resolve(err ? null : row)
      )
    })
  }

  async allID(type) {
    const field = type === "user" ? "user_id" : "group_id"
    const table = type === "user" ? "UserID" : "GroupID"
    return new Promise((resolve, reject) => {
      db.all(`SELECT ${field} FROM ${table}`, (err, rows) => {
        err ? reject(err) : resolve(rows.map((row) => row[field]))
      })
    })
  }
})()
