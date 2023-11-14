import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { initializeBot } from './src/bot.js'

config()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
})

initializeBot(client)
