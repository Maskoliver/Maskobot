import {
  handleCharacterCreationResponse,
  isCharacterCreationInProgress,
  startCharacterCreationProcess
} from './commands/character/characterCreation.js'
import commandFactory from './commands/utility/commandFactory.js'
import { Character } from './models/Character.js'
import { shouldIgnoreMessage } from './utils/messageUtils.js'

export async function handleMessage(message, db) {
  if (shouldIgnoreMessage(message)) return

  const character = new Character(message.author.id, db)
  const args = message.content.split(' ')
  const command = args.shift().toLowerCase()

  if (isCharacterCreationInProgress(message.author.id)) {
    await handleCharacterCreationResponse(message, character)
  } else if (command === '!createcharacter') {
    await startCharacterCreationProcess(message.author.id, message)
  } else {
    await executeCommand(command, character, message, args)
  }
}

async function executeCommand(command, character, message, args) {
  const handler = commandFactory.getHandler(command)
  if (handler) {
    try {
      await handler(character, message, args)
    } catch (error) {
      await handleError(command, error, message)
    }
  }
}

async function handleError(command, error, message) {
  console.error(`Error handling ${command}: `, error)
  await message.channel.send(
    `Error handling ${command}. Please try again later.`
  )
}
