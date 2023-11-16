import { ChannelType } from 'discord.js'
import { initializeDatabase } from './services/firebaseService.js'

import { handleMessage } from './messageHandler.js'

export function initializeBot(client) {
  const db = initializeDatabase()
  client.inventoryThreads = new Map()

  client.on('messageCreate', (message) => {
    handleMessage(message, db, client)
  })

  client.on('messageReactionAdd', async (reaction, user) => {
    await handleReaction(reaction, user, db, client)
  })

  client.login(process.env.BOT_TOKEN)
}
async function handleReaction(reaction, user, db, client) {
  if (user.bot) return // Ignore bot reactions

  const message = reaction.message
  if (!message.author || message.author.bot) return
  // Check if the reaction is part of an ongoing character creation process
  if (
    message.channel.type === ChannelType.GuildPublicThread ||
    message.channel.type === ChannelType.GuildPrivateThread
  ) {
    if (message.author.id === client.user.id) {
      const character = new Character(user.id, db)
      await handleCharacterCreationResponse(message, character, reaction, user)
    }
  }
}
