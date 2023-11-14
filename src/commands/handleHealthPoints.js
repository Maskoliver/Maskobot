import { createHealthBar } from '../models/Character.js'

export default async function handleHealthPoints(character, message) {
  try {
    const [currentHealth, maxHealth] = await character.getHealth()
    const healthBarDisplay = createHealthBar(currentHealth, maxHealth)
    message.channel.send(
      `Health: ${currentHealth}/${maxHealth}\n${healthBarDisplay}`
    )
  } catch (error) {
    console.error('Error retrieving health: ', error)
    message.channel.send('Error retrieving health. Please try again later.')
  }
}
