import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../firebaseConfig.js'
import { handleMessage } from './messageHandler.js'

export function initializeBot(client) {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  client.once('ready', () => {
    console.log('I am ready to serve Master!')
  })

  client.on('messageCreate', (message) => {
    const allowedChannels = ['1173658292468330516', '873997621163864116']
    console.log(message.channel.id)
    if (allowedChannels.includes(message.channel.id)) {
      handleMessage(message, db)
    }
  })

  client.login(process.env.BOT_TOKEN)
}
