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

async function handleInventoryCommand(character, message, client) {
  if (message.channel.type === 12) {
    await message.channel.send(
      `The !inventory command cannot be used inside a thread. Please use it in the main channel.`
    )
    return
  }
  if (client.inventoryThreads.has(character.charId)) {
    const threadId = client.inventoryThreads.get(character.charId)
    const thread = await message.channel.threads.fetch(threadId)
    if (thread) {
      const threadLink = `https://discord.com/channels/${message.guild.id}/${thread.id}`
      await message.channel.send(
        `Your inventory is already open in a private thread. Click here to view: ${threadLink}`
      )
      return
    }
  }
  const inventoryThread = await commandFactory.getHandler('!inventory')(
    character,
    message,
    [],
    client
  )
  if (inventoryThread) {
    client.inventoryThreads.set(character.charId, inventoryThread.id)
  }
}

async function executeCommand(command, character, message, args, client) {
  if (command === '!inventory') {
    await handleInventoryCommand(character, message, client)
    return
  }
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
