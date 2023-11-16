import { commandsList, helpCommand } from './commandList.js'

export default async function handleHelp(character, message) {
  try {
    // Determine if the help command is called within an inventory thread
    const isInventoryThread =
      message.client.inventoryThreads.has(character.charId) &&
      message.client.inventoryThreads.get(character.charId) ===
        message.channel.id

    // Filter commands based on the context
    const relevantCommands = commandsList.filter((cmd) => {
      return isInventoryThread
        ? cmd.category === 'inventory'
        : cmd.category !== 'inventory'
    })

    // Map the relevant commands to their descriptions
    const commandDescriptions = relevantCommands
      .map((cmd) => `${cmd.name} - ${cmd.description}`)
      .join('\n')

    // Add the general help command description
    const helpDescription = isInventoryThread
      ? ''
      : `${helpCommand.name} - ${helpCommand.description}\n`

    // Construct the help text
    const helpText =
      'Available commands:\n' +
      commandDescriptions +
      '\n' +
      helpDescription +
      (isInventoryThread ? '' : '!createCharacter - Create a new character\n') // Only show create character in general

    // Send the constructed help text
    await message.channel.send(helpText)
  } catch (error) {
    console.log('Error retrieving help: ', error)
    await message.channel.send(
      'Error retrieving help. Please report to master.'
    )
  }
}
