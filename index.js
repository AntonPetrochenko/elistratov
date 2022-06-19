const BotAPI = require('node-telegram-bot-api')
const fs = require('fs')
const userTracker = require('./util/userTracker.js')
const TOKEN = fs.readFileSync('./.key').toString()
const motherChatId = fs.readFileSync('./.chat')
const telegram = new BotAPI(TOKEN, {polling: true})

userTracker.setupTracker(telegram)

let aboutMe = 
`
Дороу! Вас обслуживает Бизнес-коуч Андрей Елистратов
Я умею:
`
fs.readdirSync('./games').forEach((gameBasename) => {
  let game = require('./games/' + gameBasename)
  game.setup(telegram)
  let gameInfo = game.describe()
  aboutMe += '\n ' + `<b>${gameInfo.name}</b>: ${gameInfo.description}`
})

telegram.on('message', (msg) => {
  if (!msg.text) return
  if (msg.text.match(/Андрей, (расскажи о себе|ты кто|кто ты).*/)) {
    telegram.sendMessage(msg.chat.id,aboutMe,{parse_mode: 'HTML'})
  }
})


let mayErrorMsg = true
telegram.on('polling_error', (error) => {
  console.log(error)
  if (mayErrorMsg) telegram.sendMessage(motherChatId,'Пизда рулю, гляньте консоль!')
  mayErrorMsg = false
  setTimeout(() => {mayErrorMsg = true}, 1000 * 60 * 60)
})

telegram.on('error', (error) => {
  console.log(error)
  if (mayErrorMsg) telegram.sendMessage(motherChatId,'Пизда рулю, гляньте консоль!')
  mayErrorMsg = false
  setTimeout(() => {mayErrorMsg = true}, 1000 * 60 * 60)
})

console.log(userTracker)