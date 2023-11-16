import {
  handleCharacterCreationResponse,
  isCharacterCreationInProgress,
  startCharacterCreationProcess
} from './commands/character/characterCreation.js'
import commandFactory from './commands/utility/commandFactory.js'
import { Character } from './models/Character.js'
import { shouldIgnoreMessage } from './utils/messageUtils.js'
// Note that inventoryThreads map is now expected to be attached to the client object

export async function handleMessage(message, db, client) {
  if (shouldIgnoreMessage(message)) return

  const character = new Character(message.author.id, db)
  const args = message.content.split(' ')
  const command = args.shift().toLowerCase()

  if (isCharacterCreationInProgress(message.author.id)) {
    await handleCharacterCreationResponse(message, character)
  } else if (command === '!createcharacter') {
    await startCharacterCreationProcess(message.author.id, message)
  } else {
    await executeCommand(command, character, message, args, client)
  }
}

async function executeCommand(command, character, message, args, client) {
  // Check if command is related to inventory and handle accordingly
  if (command === '!inventory') {
    // Check if an inventory thread already exists for the character
    if (!client.inventoryThreads.has(character.charId)) {
      const inventoryThread = await commandFactory.getHandler(command)(
        character,
        message,
        args,
        client
      )
      // If a thread was created, store it in the client's inventoryThreads map
      if (inventoryThread) {
        client.inventoryThreads.set(character.charId, inventoryThread.id)
      }
    }
    return // Exit early to prevent further command processing
  }

  // For other commands, check if they should be executed in the inventory thread
  const commandData = commandFactory.getCommandData(command)
  if (commandData && commandData.category === 'inventory') {
    const inventoryThreadId = client.inventoryThreads.get(character.charId)
    if (!inventoryThreadId || message.channel.id !== inventoryThreadId) {
      await message.reply(
        'You can only use this command in your inventory thread.'
      )
      return
    }
  }

  // Execute the command if it has a handler
  if (commandData && commandData.handler) {
    try {
      await commandData.handler(character, message, args, client)
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
