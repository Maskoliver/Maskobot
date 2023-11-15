import { commandsList, helpCommand } from './commandList.js'

export default async function handleHelp(character, message) {
  try {
    const commandDescriptions = commandsList
      .map((cmd) => `${cmd.name} - ${cmd.description}`)
      .join('\n')
    const helpDescription = `${helpCommand.name} - ${helpCommand.description}\n`
    const helpText =
      'Available commands:\n' +
      commandDescriptions +
      '\n' +
      helpDescription +
      '!createCharacter - Create a new character\n'

    await message.channel.send(helpText)
  } catch (error) {
    await message.channel.send(
      'Error retrieving help. Please report to master.'
    )
  }
}
