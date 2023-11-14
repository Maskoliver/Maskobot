import { ChannelType } from 'discord.js'
import {
  handleCharacterCreationResponse,
  isCharacterCreationInProgress,
  startCharacterCreationProcess
} from './commands/characterCreation.js'
import commandFactory from './commands/commandFactory.js'
import { Character } from './models/Character.js'

export async function handleMessage(message, db) {
  if (shouldIgnoreMessage(message)) return

  const character = new Character(message.author.id, db)
  const args = message.content.split(' ')
  const command = args[0]

  if (isCharacterCreationInProgress(message.author.id)) {
    await handleCharacterCreationResponse(message, character)
  } else if (command === '!createCharacter') {
    await startCharacterCreationProcess(message.author.id, message)
  } else {
    console.log('command', command)
    await handleCommand(command, character, message, args)
  }
}

function shouldIgnoreMessage(message) {
  // If the message is from a bot, ignore it.
  if (message.author.bot) return true

  // If the message does not start with '!' and is not from a thread, ignore it.
  return (
    !message.content.startsWith('!') &&
    message.channel.type !== ChannelType.GuildPublicThread &&
    message.channel.type !== ChannelType.GuildPrivateThread
  )
}

async function handleCommand(command, character, message, args) {
  const handler = commandFactory.getHandler(command)
  if (handler) {
    try {
      await handler(character, message, args)
    } catch (error) {
      console.error(`Error handling ${command}: `, error)
      message.channel.send(`Error handling ${command}. Please try again later.`)
    }
  }
}
