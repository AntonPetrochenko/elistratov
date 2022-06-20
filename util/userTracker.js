const TelegramBot = require("node-telegram-bot-api/src/telegram");
const fs = require('fs')

const tf = './targets.json'

let targets = []
if (fs.existsSync('./targets.json')) {
	targets = JSON.parse(fs.readFileSync(tf).toString())
}

//Андрей, хочу быть пидором

function rememberUser(userdata) {
	console.log('Referencing user')
	if (referenceUser(userdata)) {
		return false
	}
	else {
		let archivePath = `./userArchive/${userdata.id}.json`
		if (fs.existsSync(archivePath)) {
			console.log('Found archived user')
			let recoveredUser = JSON.parse(fs.readFileSync(archivePath))
			targets.push(recoveredUser)
			fs.writeFileSync(tf,JSON.stringify(targets))
			fs.rmSync(archivePath)
			return true
		} else {
			console.log('Brand new user')
			targets.push(userdata)
			fs.writeFileSync(tf,JSON.stringify(targets))
			return true
		}
	}
}

function forgetUser(userdata) {
	let removalTarget = referenceUser(userdata)
	if (removalTarget) {
		let archive = targets.splice(targets.indexOf(removalTarget),1)
		fs.writeFileSync(tf,JSON.stringify(targets))
		fs.writeFileSync(`./userArchive/${archive[0].id}.json`,JSON.stringify(archive[0]))
		return true
	} else {
		return false
	}
}

function kvUser(userdata, key, value) {
	let target = referenceUser(userdata)
	if (target) {
		target[key] = value
		fs.writeFileSync(tf, JSON.stringify(targets))
		return true
	} else return false
}

function referenceUser(userdata) {
	return targets.find(item => {return item.id == userdata.id})
}

function userdataFullName(userdata, ping) {
	return `${userdata.first_name? userdata.first_name : ''} ${userdata.last_name? userdata.last_name : ''} (${ping? '@' : ''}${userdata.username})`.trim()
}

module.exports = {
	setupTracker(/** @type {TelegramBot) */ telegram) {
		telegram.on('message', (msg) => {

			if (rememberUser(msg.from)) {
				telegram.sendMessage(msg.chat.id,'Я тебя запомнил, ' +  userdataFullName(msg.from))
			}

			if (msg.left_chat_member) {
				forgetUser(msg.left_chat_member)
				telegram.sendMessage(msg.chat.id,'Я забыл, кто такой ' + userdataFullName(msg.left_chat_member))
			}

			if (msg.text) {

				if (msg.text.includes('/list')) {
					let outMessage = 'Я знаю этих пидоров: \n'
					targets.forEach((target) => {
						outMessage += userdataFullName(target) + '\n'
					})
					telegram.sendMessage(msg.chat.id, outMessage)
				}

				if (msg.text.includes('Андрей, где я?')) {
					telegram.sendMessage(msg.chat.id, `Твои астральные координаты: ${msg.chat.id}`)
				}
			}
		})
	},
	/**
	 * 
	 * @returns {Array}
	 */
	getUsers() {
		return targets
	},
	kvUser: kvUser,
	referenceUser: referenceUser,
	userdataFullName: userdataFullName
	
}