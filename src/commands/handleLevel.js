export default async function handleLevel(character, message) {
  try {
    const level = await character.getLevel()
    message.channel.send(`You are at level ${level}`)
  } catch (error) {
    console.error('Error retrieving level: ', error)
    message.channel.send('Error retrieving level. Please try again later.')
  }
}
