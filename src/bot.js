import { ChannelType } from 'discord.js'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../firebaseConfig.js'
import { handleMessage } from './messageHandler.js'

export function initializeBot(client) {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  client.on('messageCreate', (message) => {
    handleMessage(message, db)
  })

  client.on('messageReactionAdd', async (reaction, user) => {
    console.log('reaction', reaction)
    if (user.bot) return // Ignore bot reactions

    const message = reaction.message
    if (!message.author || message.author.bot) return // Ensure message has an author and it's not a bot

    // Check if the reaction is part of an ongoing character creation process
    if (
      message.channel.type === ChannelType.GuildPublicThread ||
      message.channel.type === ChannelType.GuildPrivateThread
    ) {
      if (message.author.id === client.user.id) {
        const character = new Character(user.id, db)
        await handleCharacterCreationResponse(
          message,
          character,
          reaction,
          user
        )
      }
    }
  })

  client.login(process.env.BOT_TOKEN)
}
