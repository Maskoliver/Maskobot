export default async function handleHelp(character, message) {
  try {
    message.channel.send(
      'Available commands:\n' +
        '!hp - Show your current health points\n' +
        '!level - Show your current level\n' +
        '!ci - Show your character info\n' +
        '!!help - Show this help message'
    )
  } catch (error) {
    message.channel.send('Error retrieving help. Please report to master.')
  }
}
